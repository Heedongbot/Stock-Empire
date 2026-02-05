const OpenAI = require('openai');
// Force override existing environment variables
require('dotenv').config({ path: '.env.local', override: true });

const apiKey = process.env.OPENAI_API_KEY;
console.log("Key in file:", apiKey ? apiKey.substring(0, 20) + "..." : "EMPTY");

const openai = new OpenAI({ apiKey: apiKey });

async function test() {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Hello" }],
        });
        console.log("Success! Response:", completion.choices[0].message.content);
    } catch (error) {
        console.error("Error Code:", error.status);
        console.error("Error Msg:", error.message);
    }
}

test();
