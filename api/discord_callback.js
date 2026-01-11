import axios from 'axios';

export default async function handler(req, res) {
  const { code, state } = req.query; // 'state' is the token passed from the Rust client

  if (!code) {
    return res.status(400).send("No code provided from Discord.");
  }

  // 1. Swap the code for a Discord Access Token
  try {
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', 
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID, // Use Vercel Env Variables
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'https://copper-api.vercel.app/api/discord_callback',
      }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const accessToken = tokenResponse.data.access_token;

    // 2. Use the Access Token to get the User's Discord Info
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const discordUser = userResponse.data; 
    // This object contains: discordUser.id, discordUser.username, discordUser.avatar

    console.log(`Logged in as: ${discordUser.username} (${discordUser.id})`);

    /* 3. DB LOGIC (Crucial): 
       Here you would save the discordUser.id to your database 
       linked to the 'state' (which is the Copper Client token).
    */

    // 4. Redirect to the 'complete' URL so the Rust code finishes the loop
    // Your Rust code is looking for this exact path to close the window
    res.redirect(`/api/discord?token=${state}&status=complete`);

  } catch (error) {
    console.error("Auth Error:", error.response?.data || error.message);
    res.status(500).send("Authentication failed.");
  }
}
