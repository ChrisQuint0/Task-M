// app/api/gemini/route.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { prompt } = await request.json();

  if (!prompt) {
    return NextResponse.json(
      {
        error:
          "Mrow? You forgot to tell me the task! I can’t read minds... yet.",
      },
      { status: 400 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set in environment variables");
    return NextResponse.json(
      { error: "The humans behind the scenes messed something up. Classic." },
      { status: 500 }
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ generatedText: text }, { status: 200 });
  } catch (error) {
    console.error("Gemini API error: ", error);
    return NextResponse.json(
      {
        error:
          "I pawed at it, chewed it, and stared into the void... nothing came out.",
      },
      { status: 500 }
    );
  }
}
