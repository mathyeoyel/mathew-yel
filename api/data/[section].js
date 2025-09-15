// Serverless API endpoint for reading (and optionally updating) JSON data files.
// NOTE: Vercel serverless functions have an ephemeral filesystem. Runtime writes to local files
// do NOT persist between invocations. To support persistent edits from the admin panel in production,
// this function optionally commits changes back to the GitHub repository using the Contents API
// when the required environment variables are configured.
//
// Required env vars for write (POST) support:
//   GITHUB_TOKEN  -> A repo-scoped Personal Access Token with 'repo' (contents) permission
//   GITHUB_OWNER  -> Repository owner (user or org)
//   GITHUB_REPO   -> Repository name
// If these are missing, POST will return a 501 Not Implemented response with guidance.

const fs = require('fs');
const path = require('path');

// Helper: safe JSON parse
function safeParse(jsonStr) {
  try { return JSON.parse(jsonStr); } catch { return null; }
}

// Helper: GitHub commit
async function commitToGitHub(section, dataObj) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  if (!token || !owner || !repo) {
    return { ok: false, reason: 'GitHub environment variables not fully configured' };
  }

  const filePath = `data/${section}.json`;
  const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

  // 1. Get current file to retrieve SHA (if it exists)
  let sha = undefined;
  const getResp = await fetch(apiBase, { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github+json' } });
  if (getResp.status === 200) {
    const current = await getResp.json();
    sha = current.sha;
  } else if (getResp.status !== 404) {
    const text = await getResp.text();
    return { ok: false, reason: `Failed to read existing file: ${getResp.status} ${text}` };
  }

  const newContent = Buffer.from(JSON.stringify(dataObj, null, 2), 'utf8').toString('base64');
  const message = `chore: update ${filePath} via admin panel`;

  const putResp = await fetch(apiBase, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message, content: newContent, sha })
  });

  if (!putResp.ok) {
    const text = await putResp.text();
    return { ok: false, reason: `GitHub commit failed: ${putResp.status} ${text}` };
  }
  return { ok: true };
}

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { section } = req.query;
  if (!section) {
    res.status(400).json({ error: 'Section parameter is required' });
    return;
  }

  if (req.method === 'GET') {
    try {
      const filePath = path.join(process.cwd(), 'data', `${section}.json`);
      if (!fs.existsSync(filePath)) {
        res.status(404).json({ error: 'File not found' });
        return;
      }
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const data = safeParse(fileContent);
      if (data === null) {
        res.status(500).json({ error: 'Invalid JSON format in data file' });
        return;
      }
      res.status(200).json(data);
    } catch (err) {
      console.error('GET read error:', err);
      res.status(500).json({ error: 'Failed to read data file' });
    }
  } else if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const newData = body.data;
      if (typeof newData === 'undefined') {
        res.status(400).json({ error: 'Missing data in request body' });
        return;
      }

      // Attempt commit to GitHub for persistence
      const commitResult = await commitToGitHub(section, newData);
      if (!commitResult.ok) {
        res.status(501).json({
          error: 'Persistence not configured',
          details: commitResult.reason,
          hint: 'Set GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO in Vercel project settings to enable saving.'
        });
        return;
      }

      res.status(200).json({ success: true, message: 'Data committed to repository' });
    } catch (err) {
      console.error('POST write error:', err);
      res.status(500).json({ error: 'Failed to update data file' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};