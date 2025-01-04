import { NextResponse } from 'next/server';
import { PassThrough } from 'stream';
import { AssemblyAI } from 'assemblyai';
const client = new AssemblyAI({
    apiKey: process.env.ASSEMBLYAI_API_KEY!,
});

export async function POST(request: Request) {
    try {
    } catch (error) {
        console.error('Error processing request:', error);
        return new NextResponse(error instanceof Error ? error.message : 'Error processing request', { status: 500 });
    }
}
