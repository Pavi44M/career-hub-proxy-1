// Vercel Serverless Function for Anthropic API Proxy
// Path: /api/anthropic

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed. Use POST.' });
        return;
    }

    try {
        const { apiKey, messages, maxTokens } = req.body;

        // Validate input
        if (!apiKey) {
            res.status(400).json({ error: 'Missing apiKey in request body' });
            return;
        }

        if (!messages || !Array.isArray(messages)) {
            res.status(400).json({ error: 'Missing or invalid messages array' });
            return;
        }

        console.log('🔄 Proxying request to Anthropic API...');

        // Call Anthropic API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: maxTokens || 3000,
                messages: messages
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Anthropic API error:', data);
            res.status(response.status).json(data);
            return;
        }

        console.log('✅ Success! Returning response...');
        res.status(200).json(data);

    } catch (error) {
        console.error('❌ Proxy error:', error);
        res.status(500).json({ 
            error: 'Internal proxy error',
            message: error.message 
        });
    }
}
