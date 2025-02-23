import { NextRequest, NextResponse } from "next/server";

// Function to clean and filter the response
function filterResponse(response: string): string {
  if (!response) return "No response available.";

  // Remove special characters except basic punctuation
  let cleanedResponse = response.replace(/[^a-zA-Z0-9.,!?'"()\s]/g, "");

  // Remove excessive whitespace
  cleanedResponse = cleanedResponse.replace(/\s+/g, " ").trim();

  // Limit response length
  const maxLength = 500; // Adjust as needed
  if (cleanedResponse.length > maxLength) {
    cleanedResponse = cleanedResponse.substring(0, maxLength) + "...";
  }

  return cleanedResponse;
}

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
    const ollamaBaseUrl = process.env.OLLAMA_BASE_URL!;

    if (!geminiApiKey || !hfApiKey) {
      return NextResponse.json(
        { message: "Missing API keys in environment variables" },
        { status: 500 }
      );
    }

    // Determine which model to use
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
                  text: `Decide if this prompt should be answered by Gemini, DeepSeek, or LLama. Answer only 'Gemini' or 'DeepSeek' or 'LLama': "${prompt}"`,
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

    let originalResponse = "";

    if (chosenModel === "DeepSeek") {
      console.log("Using DeepSeek AI...");
      const deepSeekResponse = await fetch(ollamaBaseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "deepseek-r1:1.5b",
          prompt,
          stream: false,
        }),
      });

      const deepSeekData = await deepSeekResponse.json();
      originalResponse = deepSeekData?.response || "No response from DeepSeek AI";
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
      originalResponse =
        geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini AI";
    } else {
      console.log("Using Llama AI...");
      const llamaResponse = await fetch(ollamaBaseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3.2:3b",
          prompt,
          stream: false,
        }),
      });

      const llamaData = await llamaResponse.json();
      originalResponse = llamaData?.response || "No response from Llama AI";
    }

    console.log("Original AI Response:", originalResponse);

    // // Ask Gemini to review and refine the response
    // console.log("Sending response to Gemini for review...");
    // const geminiReviewResponse = await fetch(
    //   `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${geminiApiKey}`,
    //   {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       contents: [
    //         {
    //           parts: [
    //             {
    //               text: `Review and refine this AI-generated response to make it clearer, more informative, and grammatically correct:\n\n"${originalResponse}"`,
    //             },
    //           ],
    //         },
    //       ],
    //     }),
    //   }
    // );

    // const geminiReviewData = await geminiReviewResponse.json();
    // let reviewedResponse =
    //   geminiReviewData?.candidates?.[0]?.content?.parts?.[0]?.text ||
    //   "Error in Gemini Review.";

    // console.log("Reviewed Response by Gemini:", reviewedResponse);

    // const finalReviewedResponse = filterResponse(reviewedResponse);

    return NextResponse.json({
      modelUsed: chosenModel,
      originalResponse: originalResponse,
      // reviewedResponse: finalReviewedResponse,
    });
  } catch (error) {
    console.error("Error processing AI request:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
