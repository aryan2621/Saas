import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
    Loader2,
    Copy,
    Check,
    RotateCcw,
    Save,
    Download,
    Upload,
    MessageSquare,
    Settings2,
    FileText,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface InputColumnProps {
    input: string;
    setInput: (value: string) => void;
    onGenerate: () => void;
    onClear: () => void;
    isGenerating: boolean;
    wordCount: number;
    characterCount: number;
}

function InputColumn({
    input,
    setInput,
    onGenerate,
    onClear,
    isGenerating,
    wordCount,
    characterCount,
}: InputColumnProps) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>Input</span>
                    <div className="flex gap-2">
                        <Badge variant="secondary">{wordCount} words</Badge>
                        <Badge variant="outline">{characterCount} chars</Badge>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea
                    placeholder="Enter your text here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="h-64 min-h-[200px]"
                />
                <div className="flex gap-2">
                    <Button onClick={onGenerate} disabled={isGenerating || !input.trim()} className="flex-1">
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Generate
                            </>
                        )}
                    </Button>
                    <Button variant="outline" onClick={onClear} disabled={!input.trim()}>
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

interface OutputColumnProps {
    output: string;
    isGenerating: boolean;
    onCopy: () => void;
    isCopied: boolean;
    onDownload: () => void;
}

function OutputColumn({ output, isGenerating, onCopy, isCopied, onDownload }: OutputColumnProps) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>Output</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={onCopy} disabled={!output || isGenerating}>
                            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="sm" onClick={onDownload} disabled={!output || isGenerating}>
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isGenerating ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <div className="prose bg-muted p-4 rounded-lg h-64 overflow-auto">
                        {output ? (
                            <p>{output}</p>
                        ) : (
                            <p className="text-muted-foreground text-center mt-20">Generated text will appear here</p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

interface SettingsColumnProps {
    activeTab: string;
    setActiveTab: (value: string) => void;
    contentType: string;
    setContentType: (value: string) => void;
    length: number;
    setLength: (value: number) => void;
    tone: string;
    setTone: (value: string) => void;
    temperature: number;
    setTemperature: (value: number) => void;
    autoFormat: boolean;
    setAutoFormat: (value: boolean) => void;
}

function SettingsColumn({
    activeTab,
    setActiveTab,
    contentType,
    setContentType,
    length,
    setLength,
    tone,
    setTone,
    temperature,
    setTemperature,
    autoFormat,
    setAutoFormat,
}: SettingsColumnProps) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5" />
                    Settings
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="w-full">
                        <TabsTrigger value="chatgpt" className="flex-1">
                            ChatGPT
                        </TabsTrigger>
                        <TabsTrigger value="gemini" className="flex-1">
                            Gemini
                        </TabsTrigger>
                        <TabsTrigger value="claude" className="flex-1">
                            Claude
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="space-y-4">
                    <Select value={contentType} onValueChange={setContentType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="summary">Summary</SelectItem>
                            <SelectItem value="essay">Essay</SelectItem>
                            <SelectItem value="article">Article</SelectItem>
                            <SelectItem value="blog">Blog Post</SelectItem>
                            <SelectItem value="social">Social Media Post</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Target Length: {length} words</label>
                        <Slider
                            min={10}
                            max={1000}
                            step={10}
                            value={[length]}
                            onValueChange={(value) => setLength(value[0])}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Temperature: {temperature.toFixed(1)}</label>
                        <Slider
                            min={0}
                            max={2}
                            step={0.1}
                            value={[temperature]}
                            onValueChange={(value) => setTemperature(value[0])}
                        />
                        <p className="text-xs text-muted-foreground">
                            Lower values produce more focused output, higher values more creative
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tone</label>
                        <div className="flex flex-wrap gap-2">
                            {['professional', 'casual', 'formal', 'friendly', 'humorous', 'technical'].map((t) => (
                                <Button
                                    key={t}
                                    variant={tone === t ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setTone(t)}
                                >
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Auto-format output</label>
                        <Switch checked={autoFormat} onCheckedChange={setAutoFormat} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function AIEditor() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('chatgpt');
    const [contentType, setContentType] = useState('summary');
    const [length, setLength] = useState(250);
    const [tone, setTone] = useState('professional');
    const [temperature, setTemperature] = useState(0.7);
    const [autoFormat, setAutoFormat] = useState(true);
    const [wordCount, setWordCount] = useState(0);
    const [characterCount, setCharacterCount] = useState(0);

    useEffect(() => {
        const words = input
            .trim()
            .split(/\s+/)
            .filter((word) => word.length > 0);
        setWordCount(words.length);
        setCharacterCount(input.length);
    }, [input]);

    const generateText = async () => {
        setIsGenerating(true);
        try {
            // Simulating API call
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setOutput(
                `Generated ${contentType} with ${length} words in a ${tone} tone using ${activeTab.toUpperCase()}.\n\n` +
                    `Temperature: ${temperature}\n` +
                    `Input text: ${input}`,
            );
        } catch (error) {
            console.error('Generation failed:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `generated-${contentType}-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleClear = () => {
        setInput('');
        setOutput('');
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputColumn
                input={input}
                setInput={setInput}
                onGenerate={generateText}
                onClear={handleClear}
                isGenerating={isGenerating}
                wordCount={wordCount}
                characterCount={characterCount}
            />
            <OutputColumn
                output={output}
                isGenerating={isGenerating}
                onCopy={handleCopy}
                isCopied={isCopied}
                onDownload={handleDownload}
            />
            <SettingsColumn
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                contentType={contentType}
                setContentType={setContentType}
                length={length}
                setLength={setLength}
                tone={tone}
                setTone={setTone}
                temperature={temperature}
                setTemperature={setTemperature}
                autoFormat={autoFormat}
                setAutoFormat={setAutoFormat}
            />
        </div>
    );
}
