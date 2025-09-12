// API endpoint for reading JSON data files
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { section } = req.query;

  if (req.method === 'GET') {
    try {
      // Read the JSON file from the data directory
      const filePath = path.join(process.cwd(), 'data', `${section}.json`);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
      }

      const fileContent = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(fileContent);
      
      res.status(200).json(data);
    } catch (error) {
      console.error('Error reading file:', error);
      res.status(500).json({ error: 'Failed to read data file' });
    }
  } else if (req.method === 'POST') {
    try {
      // Write updated JSON data to file
      const { data } = req.body;
      const filePath = path.join(process.cwd(), 'data', `${section}.json`);
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      
      res.status(200).json({ success: true, message: 'Data updated successfully' });
    } catch (error) {
      console.error('Error writing file:', error);
      res.status(500).json({ error: 'Failed to update data file' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}