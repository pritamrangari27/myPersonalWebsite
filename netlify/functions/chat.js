exports.handler = async function (event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const body = JSON.parse(event.body);
        const userMessage = body.message;

        if (!userMessage) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Message is required' })
            };
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("GEMINI_API_KEY is not set in environment variables");
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Server configuration error' })
            };
        }

        // Gemini System Prompt to give context to the AI
        const systemPrompt = `You are Pritam AI, the virtual assistant for Pritam Rangari's portfolio website. 
Pritam is an IT Engineering student at AISSMS Institute of Information Technology, Pune (2023-2027).
He specializes in Web Development (HTML, CSS, JS, React, Tailwind), Backend (Node.js, Python, MongoDB, Flask), and Languages (Java, C++).
He has built projects like a Crime Management System, HomeWifiMonitor, and an E-Learning Platform.
He is available for freelance work and internships. His email is pritamrangari125@gmail.com and phone is +91 87675 31150.
Keep your answers brief, professional, and friendly. Answer any questions the user asks based on this context or general knowledge.`;

        // Prepare the request for Gemini 1.5 Flash API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [
                            { text: systemPrompt + "\n\nUser Question: " + userMessage }
                        ]
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API Error:", errorText);
            throw new Error(`Gemini API responded with status: ${response.status}`);
        }

        const data = await response.json();

        // Extract the text response from the Gemini API format
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response at this moment.";

        return {
            statusCode: 200,
            body: JSON.stringify({ reply: replyText })
        };

    } catch (error) {
        console.error("Error in chat function:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to process request' })
        };
    }
};
