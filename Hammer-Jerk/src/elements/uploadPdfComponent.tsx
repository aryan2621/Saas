'use client';

import { useState, useRef } from 'react';
import { uploadDocument } from '@/utils/firebase';
import { Loader2, ExternalLink, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function UploadPDFComponent() {
    const [file, setFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);

    const handleFileChange = (selectedFile: File | null) => {
        if (selectedFile) {
            if (selectedFile.type !== 'application/pdf') {
                toast('Please select a PDF file');
                return;
            }
            if (selectedFile.size > 10 * 1024 * 1024) {
                toast('File size is too large, max size is 10MB');
                return;
            }
            setFile(selectedFile);
            uploadDocument(
                selectedFile,
                'documents',
                (progress) => setUploadProgress(progress),
                (url) => setPdfUrl(url),
            );
        } else {
            toast('Please select a PDF file');
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        handleFileChange(droppedFile);
    };

    const handleReset = () => {
        setFile(null);
        setUploadProgress(0);
        setPdfUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleAnalyze = async () => {
        const response = await fetch('/api/get-pdf-analysis', {
            method: 'POST',
            body: JSON.stringify({ pdfUrl }),
        });
        const data = await response.json();
        setAnalysis(data.results);
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardContent className="p-6">
                {!file ? (
                    <div
                        className={`cursor-pointer relative border-2 border-dashed rounded-lg p-12 transition-colors ${
                            isDragging
                                ? 'border-primary bg-primary/5 border-dashed'
                                : 'border-muted-foreground/25 hover:border-primary'
                        }`}
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsDragging(true);
                        }}
                        onDragEnter={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsDragging(true);
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsDragging(false);
                        }}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {isDragging && (
                            <div className="absolute inset-0 bg-primary/10 z-10 flex items-center justify-center rounded-lg"></div>
                        )}
                        <input
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                        />
                        <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">Drag and drop your PDF here</h3>
                            <p className="mt-2 text-sm text-muted-foreground">Supported file: PDF (Max size: 10MB)</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="relative border rounded-lg overflow-hidden">
                            <div className="aspect-video w-full h-[70vh]">
                                {pdfUrl ? (
                                    <>
                                        <div className="absolute top-2 left-2 z-10">
                                            <Button asChild variant="outline" size="sm">
                                                <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="mr-2 h-4 w-4" />
                                                </a>
                                            </Button>
                                        </div>
                                        <iframe
                                            src={`${pdfUrl}#toolbar=0`}
                                            className="w-full h-full"
                                            title="PDF Preview"
                                        />
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleReset} variant="outline">
                                <X className="mr-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
                <div className="flex justify-end">
                    <Button onClick={handleAnalyze}>Analyze</Button>
                </div>
                {analysis && <div className="mt-4">{analysis}</div>}
            </CardContent>
        </Card>
    );
}
