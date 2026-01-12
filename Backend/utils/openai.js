import "dotenv/config";
import fetch from "node-fetch";

const getOpenAIAPIResponse = async (message) => {
    try {
        const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: message }]
                })
            }
        );

        if (!response.ok) {
            throw new Error("OpenAI API error");
        }

        const data = await response.json();
        return data.choices[0].message.content;

    } catch (err) {
        console.error(err);
        return "AI service is currently unavailable.";
    }
};

export default getOpenAIAPIResponse;
