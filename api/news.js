export default function handler(req, res) {
  res.status(200).json([
    {
      id: 1,
      title: "COPPER CLIENT ALPHA IS HERE",
      content: "Gamer Ben has officially successfully forked the API. NoRisk infrastructure removed.",
      date: Date.now(),
      image: "https://your-domain.com/copper-logo.png"
    }
  ]);
}
