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
                'User-Agent': 'AlbumTracker/1.0 +https://github.com/mtnutholme'
            }
        });
        
        // Get response text first
        const text = await response.text();
        
        // Try to parse as JSON
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            // If not JSON, return as text
            return res.status(response.status).send(text);
        }
        
        // Return the JSON data with the same status code from Discogs
        return res.status(response.status).json(data);
        
    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({ 
            error: error.message,
            details: 'Failed to fetch from Discogs API'
        });
    }
}
