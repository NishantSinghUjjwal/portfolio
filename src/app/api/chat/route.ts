import { NextRequest, NextResponse } from 'next/server';
import Together from 'together-ai';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.TOGETHER_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Together API key is not configured on the server' },
        { status: 500 }
      );
    }

    const together = new Together({ apiKey });
    const body = await req.json();
    const { messages, model } = body;

    const response = await together.chat.completions.create({
      messages,
      model: model || "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8"
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error calling Together API:', error);
    return NextResponse.json(
      { error: error.message || 'Error calling Together API' },
      { status: 500 }
    );
  }
} 