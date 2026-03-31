// app/api/chat/route.ts

import { NextResponse } from 'next/server';
import axios from 'axios';

const CLAUDE_API_URL = 'https://api.claude.ai/v1/chat';
const SYSTEM_PROMPT = 'You are an AI that assists users with their queries intelligently and efficiently.';

export async function POST(request: Request) {
    const { userMessage } = await request.json();

    try {
        const response = await axios.post(CLAUDE_API_URL, {
            prompt: `${SYSTEM_PROMPT}\nUser: ${userMessage}\nAI:`,
            maxTokens: 150,
            temperature: 0.7,
        });

        const aiMessage = response.data.choices[0].text.trim();
        return NextResponse.json({ aiMessage });
    } catch (error) {
        console.error('Error occurred while calling Claude API:', error);
        return NextResponse.json({ error: 'Failed to get response from AI.' }, { status: 500 });
    }
}