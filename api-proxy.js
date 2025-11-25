// Simple Anthropic API Proxy for Career Hub
// Deploy to Vercel

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const { apiKey, messages, maxTokens } = req.body;

        if (!apiKey || !messages) {
            res.status(400).json({ error: 'Missing apiKey or messages' });
            return;
        }

        console.log('📡 Proxying request to Anthropic...');

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
            console.error('❌ Anthropic error:', data);
            res.status(response.status).json(data);
            return;
        }

        console.log('✅ Success!');
        res.status(200).json(data);

    } catch (error) {
        console.error('❌ Proxy error:', error);
        res.status(500).json({ 
            error: 'Proxy error',
            message: error.message 
        });
    }
}
