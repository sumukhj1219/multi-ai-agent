import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { message: "Prompt is required" },
        { status: 400 }
      );
    }

    const geminiApiKey = process.env.GEMINI_API_KEY!;
    const hfApiKey = process.env.HUGGINGFACE_API_KEY!; 

    if (!geminiApiKey || !hfApiKey) {
      return NextResponse.json(
        { message: "Missing API keys in environment variables" },
        { status: 500 }
      );
    }

    const langResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Decide if this prompt should be answered by Gemini, DeepSeek, or Mistral. Answer only 'Gemini' or 'DeepSeek' or 'Mistral': "${prompt}"`,
                },
              ],
            },
          ],
        }),
      }
    );

    const langData = await langResponse.json();
    const chosenModel = langData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    console.log("Gemini decision:", chosenModel);

    let responseText = "";

    if (chosenModel === "DeepSeek") {
      console.log("Using DeepSeek AI...");
      const deepSeekResponse = await fetch("https://api.deepseek.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "deepseek-r1:1.5b",
          prompt,
          stream: false,
        }),
      });

      const deepSeekData = await deepSeekResponse.json();
      responseText = deepSeekData?.response || "No response from DeepSeek AI";
    } else if (chosenModel === "Gemini") {
      console.log("Using Gemini AI...");
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const geminiData = await geminiResponse.json();
      responseText =
        geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini AI";
    } else {
      console.log("Using Mistral via Hugging Face...");
      const hfClient = new HfInference(hfApiKey);
      const chatCompletion = await hfClient.chatCompletion({
        model: "mistralai/Mistral-7B-Instruct-v0.3",
        messages: [{ role: "user", content: prompt }],
        provider: "novita",
        max_tokens: 500,
      });

      responseText = chatCompletion.choices?.[0]?.message?.content || "No response from Mistral AI";
    }

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error("Error processing AI request:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}