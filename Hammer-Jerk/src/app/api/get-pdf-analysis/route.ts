import { NextResponse } from 'next/server';
import 'pdf-parse';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { downloadDocument } from '@/utils/firebase';
import { ChatOpenAI } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { ChatPromptTemplate } from '@langchain/core/prompts';

const model = new ChatOpenAI({ model: 'gpt-4o', apiKey: process.env.OPENAI_API_KEY });
const systemTemplate = [
    `You are an assistant for question-answering tasks. `,
    `Use the following pieces of retrieved context to answer `,
    `the question. If you don't know the answer, say that you `,
    `don't know. Use three sentences maximum and keep the `,
    `answer concise.`,
    `\n\n`,
    `{context}`,
].join('');

export async function POST(request: Request) {
    try {
        const { pdfUrl } = await request.json();
        const file = await downloadDocument(pdfUrl);
        const loader = new PDFLoader(file);
        const docs = await loader.load();

        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const splits = await textSplitter.splitDocuments(docs);
        const vectorstore = await MemoryVectorStore.fromDocuments(splits, new OpenAIEmbeddings());
        const retriever = vectorstore.asRetriever();
        const prompt = ChatPromptTemplate.fromMessages([
            ['system', systemTemplate],
            ['human', '{input}'],
        ]);

        const questionAnswerChain = await createStuffDocumentsChain({
            llm: model,
            prompt,
        });
        const ragChain = await createRetrievalChain({
            retriever,
            combineDocsChain: questionAnswerChain,
        });

        const results = await ragChain.invoke({
            input: 'What is the professional experience of the user',
        });
        console.log(results.context);
        return NextResponse.json({ results: results.context[0].pageContent }, { status: 200 });
    } catch (error) {
        console.error('Error processing request:', error);
        return new NextResponse(error instanceof Error ? error.message : 'Error processing request', { status: 500 });
    }
}
