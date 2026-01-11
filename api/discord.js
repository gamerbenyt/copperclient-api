export default function handler(req, res) {
  const { token } = req.query; // Your Rust code sends ?token=...
  
  // Replace these with your actual Discord App credentials from the Discord Developer Portal
  const CLIENT_ID = '1459667271944503296';
  const REDIRECT_URI = encodeURIComponent('https://copper-api.vercel.app/api/discord_callback');

  // If the client is checking the "Complete" status
  if (req.url.includes('/complete')) {
    return res.status(200).send("<h1>Success!</h1><p>Discord linked to Copper. You can close this window.</p>");
  }

  // Otherwise, start the OAuth flow
  const discordUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify&state=${token}`;
  
  res.redirect(discordUrl);
}
