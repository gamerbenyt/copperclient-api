export default function handler(req, res) {
  const { token } = req.query;
  const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  
  // The redirect_uri must be the FULL URL of your callback file
  const REDIRECT_URI = encodeURIComponent("https://copperclient-api.vercel.app/api/discord_callback");

  const discordUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify&state=${token}`;
  
  res.redirect(discordUrl);
}
