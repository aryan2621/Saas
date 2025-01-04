'use client';

import { useState, useRef } from 'react';
import { uploadDocument } from '@/utils/firebase';
import { Loader2, ExternalLink, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function UploadVideoComponent() {
    const [file, setFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (selectedFile: File | null) => {
        if (selectedFile) {
            if (!selectedFile.type.startsWith('video/')) {
                toast('Please select a video file');
                return;
            }
            if (selectedFile.size > 100 * 1024 * 1024) {
                toast('File size is too large, max size is 100MB');
                return;
            }
            setFile(selectedFile);
            uploadDocument(
                selectedFile,
                'videos',
                (progress) => setUploadProgress(progress),
                (url) => setVideoUrl(url),
            );
        } else {
            toast('Please select a video file');
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
        setVideoUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
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
                            accept="video/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                        />
                        <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">Drag and drop your video here</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Supported files: MP4, WebM, etc. (Max size: 100MB)
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="relative border rounded-lg overflow-hidden">
                            <div className="aspect-video w-full h-[70vh]">
                                {videoUrl ? (
                                    <>
                                        <video src={videoUrl} controls className="w-full h-full" preload="metadata">
                                            Your browser does not support the video tag.
                                        </video>
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
            </CardContent>
        </Card>
    );
}
