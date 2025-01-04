export const geminiModels: {
    label: string;
    value: string;
    description: string;
    type: 'gemini' | 'openai' | 'anthropic';
}[] = [
    {
        label: 'Gemini 1.5 Flash',
        value: 'gemini-1.5-flash',
        description: 'Fast and versatile performance across a diverse variety of tasks',
        type: 'gemini',
    },
    {
        label: 'Gemini 1.5 Flash-8B',
        value: 'gemini-1.5-flash-8b',
        description: 'High volume and lower intelligence tasks',
        type: 'gemini',
    },
    {
        label: 'Gemini 1.5 Pro',
        value: 'gemini-1.5-pro',
        description: 'Complex reasoning tasks requiring more intelligence',
        type: 'gemini',
    },
    {
        label: 'Gemini 1.0 Pro',
        value: 'gemini-1.0-pro',
        description: 'Natural language tasks, multi-turn text and code chat, and code generation',
        type: 'gemini',
    },
    {
        label: 'Text Embedding',
        value: 'text-embedding-004',
        description: 'Measuring the relatedness of text strings',
        type: 'gemini',
    },
    {
        label: 'AQA',
        value: 'aqa',
        description: 'Providing source-grounded answers to questions',
        type: 'gemini',
    },
];

export const openaiModels: {
    label: string;
    value: string;
    description: string;
    type: 'gemini' | 'openai' | 'anthropic';
}[] = [
    {
        label: 'GPT 4o',
        value: 'gpt-4o',
        description: 'Our high-intelligence flagship model for complex, multi-step tasks, cheaper and faster.',
        type: 'openai',
    },
    {
        label: 'GPT 4o Mini',
        value: 'gpt-4o-mini',
        description:
            'Affordable & intelligent small model for fast, lightweight tasks. More capable than GPT-3.5 Turbo.',
        type: 'openai',
    },
    {
        label: 'O1 Preview',
        value: 'o1-preview',
        description: 'Points to the most recent snapshot of the o1 model: o1-preview-2024-09-12',
        type: 'openai',
    },
    {
        label: 'O1 Mini',
        value: 'o1-mini',
        description: 'Points to the most recent o1-mini snapshot: o1-mini-2024-09-12',
        type: 'openai',
    },
    {
        label: 'GPT 4 Turbo',
        value: 'gpt-4-turbo',
        description: 'The latest GPT-4 Turbo model with vision capabilities, now use JSON mode and function calling.',
        type: 'openai',
    },
    {
        label: 'GPT 4 Turbo Preview',
        value: 'gpt-4-turbo-preview',
        description: 'GPT-4 Turbo preview model.',
        type: 'openai',
    },
    {
        label: 'GPT 3.5 Turbo',
        value: 'gpt-3.5-turbo-0125',
        description: 'The latest GPT-3.5 Turbo model with higher accuracy at responding in requested formats.',
        type: 'openai',
    },
];

export class Model {
    label: string;
    value: string;
    description: string;
    type: 'gemini' | 'openai' | 'anthropic';
    constructor(label: string, value: string, description: string, type: 'gemini' | 'openai' | 'anthropic') {
        this.label = label;
        this.value = value;
        this.description = description;
        this.type = type;
    }
}
export const modelTypes = ['gemini', 'openai', 'anthropic'];
export const models = [...geminiModels, ...openaiModels];
