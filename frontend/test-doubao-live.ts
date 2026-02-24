import OpenAI from 'openai';

const apiKey = process.env.DOUBAO_API_KEY;
const baseURL = process.env.DOUBAO_API_BASE_URL || "https://ark.cn-beijing.volces.com/api/v3";
const model = process.env.DOUBAO_MODEL_ID || 'doubao-seed-2-0-mini-260215';

async function testDoubao() {
    console.log('Testing Doubao API...');
    console.log('Base URL:', baseURL);
    console.log('Model:', model);
    console.log('API Key:', apiKey ? '***' + apiKey.slice(-4) : 'Missing');

    if (!apiKey) {
        console.error('Error: DOUBAO_API_KEY is missing in .env');
        return;
    }

    const client = new OpenAI({
        apiKey: apiKey,
        baseURL: baseURL,
    });

    try {
        const completion = await client.chat.completions.create({
            messages: [
                { role: 'user', content: 'Say "Hello, World!"' }
            ],
            model: model,
        });

        console.log('\n? API Connection Successful!');
        console.log('Response:', completion.choices[0].message.content);
    } catch (error: any) {
        console.error('\n? API Connection Failed!');
        console.error('Error Message:', error.message);
        if (error.status) console.error('Status Code:', error.status);
        if (error.type) console.error('Error Type:', error.type);
    }
}

testDoubao();
