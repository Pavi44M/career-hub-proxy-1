# Career Hub AI Proxy Server

This is a Vercel serverless function that proxies requests to the Anthropic Claude API to bypass CORS restrictions.

## Structure
```
/
├── api/
│   └── anthropic.js   (Serverless function - handles API requests)
├── vercel.json        (Vercel configuration)
├── package.json       (Node.js package config)
└── README.md         (This file)
```

## How to Deploy

### Method 1: Via GitHub (Recommended)

1. Create new GitHub repository: `career-hub-proxy`
2. Upload ALL files from this folder:
   - `api/anthropic.js`
   - `vercel.json`
   - `package.json`
   - `README.md`
3. Go to Vercel → Import → Select this repo
4. Deploy!

### Method 2: Vercel CLI

```bash
npm i -g vercel
cd career-hub-proxy
vercel
```

## After Deployment

Your proxy will be available at:
```
https://your-project.vercel.app/api/anthropic
```

## Usage

From your Career Hub, send POST requests to your proxy URL:

```javascript
const response = await fetch('https://your-project.vercel.app/api/anthropic', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        apiKey: 'your-anthropic-api-key',
        messages: [
            { role: 'user', content: 'Hello!' }
        ],
        maxTokens: 1000
    })
});

const data = await response.json();
console.log(data.content[0].text);
```

## Testing

After deployment, test with:
```bash
curl -X POST https://your-project.vercel.app/api/anthropic \
  -H "Content-Type: application/json" \
  -d '{"apiKey":"sk-ant-...","messages":[{"role":"user","content":"test"}],"maxTokens":50}'
```

## Important Notes

- ✅ CORS enabled for all origins
- ✅ Handles OPTIONS preflight requests
- ✅ Validates input data
- ✅ Proper error handling
- ✅ 30 second timeout
- ✅ 1GB memory allocation

## Security

⚠️ Your API key is sent to this proxy but is NOT stored anywhere. It's only used to make the request to Anthropic.

The proxy runs on Vercel's serverless infrastructure - each request is isolated.
