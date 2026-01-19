export default async function handler(req, res) {
    // Enable CORS for your Album Tracker
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Get the Discogs API URL from query parameter
    const { url } = req.query;
    
    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }
    
    try {
        // Fetch from Discogs API
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'AlbumTracker/1.0'
            }
        });
        
        const data = await response.json();
        
        // Return the data
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
