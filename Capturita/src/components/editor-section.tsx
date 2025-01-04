'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { VideoToolbar } from './video-toolbar';
import { VideoControls } from './video-controls';
import ky from 'ky';
import { toast } from 'sonner';
import { uploadVideo } from '@/utils/supabase';
import { Button } from './ui/button';
import { Check, X } from 'lucide-react';

const getVideoDimensions = (containerWidth: number) => {
    const maxWidth = 1280;
    const aspectRatio = 16 / 9;

    const width = Math.min(containerWidth, maxWidth);
    const height = width / aspectRatio;

    return { width, height };
};

export function EditorSection() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const [dimensions, setDimensions] = useState({ width: 640, height: 360 });
    const [isPlaying, setIsPlaying] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [gradientStart, setGradientStart] = useState('#ff0000');
    const [gradientEnd, setGradientEnd] = useState('#0000ff');
    const [padding, setPadding] = useState(20);
    const [borderRadius, setBorderRadius] = useState(16);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const animationFrameRef = useRef<number>();
    const isDrawingRef = useRef(false);

    const [filePath, setFilePath] = useState<string | null>(null);
    const [uploadingToDrive, setUploadingToDrive] = useState(false);
    const [driveAuthCode, setDriveAuthCode] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadingSuccess, setUploadingSuccess] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const newDimensions = getVideoDimensions(containerWidth);
                setDimensions(newDimensions);
                if (canvasRef.current) {
                    canvasRef.current.width = newDimensions.width;
                    canvasRef.current.height = newDimensions.height;
                }
            }
        };

        handleResize(); // Initial size
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    useEffect(() => {
        const handleRecordingComplete = (event: CustomEvent<{ file: File }>) => {
            const videoUrl = URL.createObjectURL(event.detail.file);
            setVideoFile(event.detail.file);
            if (videoRef.current) {
                videoRef.current.src = videoUrl;
                videoRef.current.addEventListener('loadeddata', drawFrame);
            }
        };

        window.addEventListener('recordingComplete', handleRecordingComplete as EventListener);
        return () => window.removeEventListener('recordingComplete', handleRecordingComplete as EventListener);
    }, []);

    const updateCanvasSize = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        if (isFullscreen) {
            const containerWidth = window.innerWidth;
            const containerHeight = window.innerHeight;
            const aspectRatio = dimensions.width / dimensions.height;

            let newWidth = containerWidth;
            let newHeight = containerWidth / aspectRatio;

            if (newHeight > containerHeight) {
                newHeight = containerHeight;
                newWidth = containerHeight * aspectRatio;
            }

            canvas.style.width = `${newWidth}px`;
            canvas.style.height = `${newHeight}px`;
            container.style.width = '100vw';
            container.style.height = '100vh';
            container.style.position = 'fixed';
            container.style.top = '0';
            container.style.left = '0';
            container.style.zIndex = '50';
            container.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        } else {
            canvas.style.width = `${dimensions.width}px`;
            canvas.style.height = `${dimensions.height}px`;
            container.style.width = 'auto';
            container.style.height = 'auto';
            container.style.position = 'relative';
            container.style.backgroundColor = 'transparent';
        }
    }, [isFullscreen, dimensions]);

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const drawFrame = useCallback(() => {
        if (isDrawingRef.current) return;
        isDrawingRef.current = true;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas?.getContext('2d');

        if (!canvas || !video || !ctx) {
            isDrawingRef.current = false;
            return;
        }
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, gradientStart);
        gradient.addColorStop(1, gradientEnd);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        const videoWidth = canvas.width - padding * 2;
        const videoHeight = canvas.height - padding * 2;
        const xOffset = padding;
        const yOffset = padding;
        ctx.beginPath();
        ctx.moveTo(xOffset + borderRadius, yOffset);
        ctx.lineTo(xOffset + videoWidth - borderRadius, yOffset);
        ctx.quadraticCurveTo(xOffset + videoWidth, yOffset, xOffset + videoWidth, yOffset + borderRadius);
        ctx.lineTo(xOffset + videoWidth, yOffset + videoHeight - borderRadius);
        ctx.quadraticCurveTo(xOffset + videoWidth, yOffset + videoHeight, xOffset + videoWidth - borderRadius, yOffset + videoHeight);
        ctx.lineTo(xOffset + borderRadius, yOffset + videoHeight);
        ctx.quadraticCurveTo(xOffset, yOffset + videoHeight, xOffset, yOffset + videoHeight - borderRadius);
        ctx.lineTo(xOffset, yOffset + borderRadius);
        ctx.quadraticCurveTo(xOffset, yOffset, xOffset + borderRadius, yOffset);
        ctx.closePath();
        ctx.clip();
        if (!video.paused || !isPlaying) {
            ctx.drawImage(video, xOffset, yOffset, videoWidth, videoHeight);
        }
        ctx.restore();
        isDrawingRef.current = false;

        if (isPlaying) {
            animationFrameRef.current = requestAnimationFrame(drawFrame);
        }
    }, [gradientStart, gradientEnd, padding, borderRadius, isPlaying]);

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };
    const handleDownload = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        setIsDownloading(true);

        try {
            videoRef.current.pause();
            setIsPlaying(false);
            const canvas = canvasRef.current;
            const stream = canvas.captureStream();
            chunksRef.current = [];
            mediaRecorderRef.current = new MediaRecorder(stream, {
                // mimeType: 'video/webm;codecs=vp9',
                mimeType: 'video/mp4',
                videoBitsPerSecond: 5000000, // 5 Mbps for high quality
            });

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, {
                    type: 'video/mp4',
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'edited-video.mp4';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                setIsDownloading(false);
            };
            mediaRecorderRef.current.start();
            videoRef.current.currentTime = 0;
            await videoRef.current.play();
            videoRef.current.onended = () => {
                if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                    mediaRecorderRef.current.stop();
                    videoRef.current!.onended = null;
                }
            };
        } catch (error) {
            console.error('Error during download:', error);
            setIsDownloading(false);
        }
    };

    useEffect(() => {
        const video = videoRef.current;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => {
            setIsPlaying(false);
            if (video) video.currentTime = 0;
        };

        if (video) {
            video.addEventListener('play', handlePlay);
            video.addEventListener('pause', handlePause);
            video.addEventListener('ended', handleEnded);
        }

        return () => {
            if (video) {
                video.removeEventListener('play', handlePlay);
                video.removeEventListener('pause', handlePause);
                video.removeEventListener('ended', handleEnded);
                video.removeEventListener('loadeddata', drawFrame);
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [drawFrame]);

    useEffect(() => {
        if (videoRef.current && videoFile) {
            drawFrame();
        }
    }, [gradientStart, gradientEnd, padding, borderRadius, drawFrame, videoFile]);

    useEffect(() => {
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
        return () => window.removeEventListener('resize', updateCanvasSize);
    }, [updateCanvasSize]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isFullscreen) {
                setIsFullscreen(false);
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isFullscreen]);

    const updateVideoToDrive = async () => {
        const response = await ky.post('/api/upload-at-drive', {
            json: { videoFile },
        });
    };

    const upsertVideo = async () => {
        if (!videoFile) {
            toast.error('No video file to upload');
            return;
        }
        try {
            setUploading(true);
            const filePath = await uploadVideo(videoFile);
            await ky.post('/api/video', {
                json: { path: filePath },
            });
            setFilePath(filePath);
            setUploadingSuccess(true);
            setUploading(false);
            toast.success('File has been uploaded successfully');
        } catch (error) {
            console.error('Error uploading video', error);
            toast.error('Error while uploading video');
        } finally {
            setUploading(false);
            setUploadingSuccess(false);
        }
    };

    const handleReject = () => {
        setVideoFile(null);
        setFilePath(null);
    };

    return (
        <div className='container mx-auto px-4 py-6'>
            <div className='grid lg:grid-cols-3 gap-6'>
                <div className='lg:col-span-2'>
                    <div
                        ref={containerRef}
                        className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black/90 flex items-center justify-center' : 'w-full'}`}
                    >
                        <div className='relative'>
                            <canvas
                                ref={canvasRef}
                                width={dimensions.width}
                                height={dimensions.height}
                                className={`w-full h-auto border rounded-lg shadow-xl ${isFullscreen ? 'max-w-full max-h-full' : ''}`}
                            />

                            {videoFile && !uploadingSuccess && (
                                <>
                                    <div className='absolute top-2 left-2 flex space-x-2'>
                                        <Button className='outline' disabled={uploading} onClick={upsertVideo}>
                                            <Check className='w-4 h-4 mr-2' />
                                        </Button>
                                        <Button disabled={uploading} className='outline' onClick={handleReject}>
                                            <X className='w-4 h-4 mr-2' />
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>

                        <video ref={videoRef} className='hidden' playsInline />
                    </div>
                </div>
                <div className='space-y-4'>
                    <VideoControls
                        isPlaying={isPlaying}
                        isDownloading={isDownloading}
                        isFullscreen={isFullscreen}
                        videoFile={videoFile}
                        onPlayPause={togglePlayPause}
                        onDownload={handleDownload}
                        onToggleFullscreen={toggleFullscreen}
                    />
                    <VideoToolbar
                        gradientStart={gradientStart}
                        gradientEnd={gradientEnd}
                        padding={padding}
                        borderRadius={borderRadius}
                        setGradientStart={setGradientStart}
                        setGradientEnd={setGradientEnd}
                        setPadding={setPadding}
                        setBorderRadius={setBorderRadius}
                    />
                </div>
            </div>
        </div>
    );
}
