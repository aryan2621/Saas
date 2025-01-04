import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';

const gptClient = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_CHATGPT_API_KEY,
});
const anthropicClient = new Anthropic({
    apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
});

const googleClient = new GoogleGenerativeAI(
    process.env.NEXT_PUBLIC_GOOGLE_API_KEY!
);

const chatGptCompletion = async (prompt: string) => {
    const chatCompletion = await gptClient.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
    });
};
