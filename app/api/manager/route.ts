import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { message: "Prompt is required" },
        { status: 400 }
      );
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      return NextResponse.json(
        { message: "Missing GEMINI_API_KEY in environment variables" },
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
            { parts: [{ text: `Decide if this prompt should be answered by Gemini or DeepSeek. Answer only 'Gemini' or 'DeepSeek': "${prompt}"` }] }
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
      const deepSeekResponse = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "deepseek-r1:1.5b",
          prompt: prompt,
          stream: false
        }),
      });

      const deepSeekData = await deepSeekResponse.json();
      console.log(deepSeekData)
      responseText = deepSeekData?.response || "No response from DeepSeek AI";
    } else {
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
      responseText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini AI";
    }

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error("Error processing AI request:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
