import axios from 'axios';

export default async function handler(req, res) {
  const { code, state } = req.query; 

  if (!code) {
    return res.status(400).send("No code provided from Discord.");
  }

  try {
    // 1. Swap the code for a Discord Access Token
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', 
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID, 
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'https://copper-api.vercel.app/api/discord_callback',
      }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const accessToken = tokenResponse.data.access_token;

    // 2. Get User Info
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const discordUser = userResponse.data;
    console.log(`User Logged In: ${discordUser.username}`);

    // 3. THE HANDSHAKE
    // We redirect the user to the OLD NoRisk URL that your Rust code is hard-coded to watch.
    // This trick "fools" the Rust loop into thinking the old API finished the job.
    res.redirect(`https://api.norisk.gg/api/v1/core/oauth/discord/complete?token=${state}&id=${discordUser.id}`);

  } catch (error) {
    console.error("Auth Error:", error.response?.data || error.message);
    res.status(500).send("Authentication failed.");
  }
}
