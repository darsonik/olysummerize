export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { text, summary_length } = req.body;
  
      const response = await fetch('http://localhost:5000/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, summary_length }),
      });
  
      const data = await response.json();
      res.status(200).json(data);
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  