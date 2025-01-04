'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Video, Volume2 } from 'lucide-react';
import { toast } from 'sonner';
import { useHotkeys } from '../hooks/use-hotkeys';

export const RecordingSection = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    useHotkeys('alt+r', () => toggleRecording());

    const getMimeType = () => {
        const types = ['video/mp4', 'video/webm;codecs=h264,aac'];
        for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) {
                return type;
            }
        }
        return 'video/webm'; // Fallback
    };

    const startRecording = async () => {
        try {
            const displayStream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    width: { ideal: 1920, max: 1920 },
                    height: { ideal: 1080, max: 1080 },
                    frameRate: { ideal: 30 },
                },
            });
            let combinedStream = displayStream;
            if (isAudioEnabled) {
                try {
                    const audioStream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            echoCancellation: true,
                            noiseSuppression: true,
                            sampleRate: 44100,
                        },
                    });
                    const tracks = [...displayStream.getTracks(), ...audioStream.getTracks()];
                    combinedStream = new MediaStream(tracks);
                } catch (audioErr) {
                    toast.error('Could not access microphone. Recording without audio.');
                }
            }

            const mimeType = getMimeType();
            const mediaRecorder = new MediaRecorder(combinedStream, {
                mimeType,
                videoBitsPerSecond: 5000000, // 5 Mbps
            });
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
                const fileName = `screen-recording-${Date.now()}.mp4`;
                const file = new File([blob], fileName, { type: 'video/mp4' });

                window.dispatchEvent(
                    new CustomEvent('recordingComplete', {
                        detail: { file },
                    })
                );

                setIsRecording(false);
                toast.success('Recording completed! Preview ready.');
            };

            mediaRecorder.start(1000);
            setIsRecording(true);
            toast.success(`Recording started! ${isAudioEnabled ? 'Audio enabled' : 'Audio disabled'}`);
        } catch {
            toast.error('Failed to start recording');
            setIsRecording(false);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    return (
        <Card className='mb-8'>
            <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                    <Monitor className='h-6 w-6' />
                    <span>Screen Recording</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='flex flex-col space-y-4'>
                    <div className='flex flex-col sm:flex-row gap-4'>
                        <Button
                            variant={isRecording ? 'destructive' : 'default'}
                            onClick={toggleRecording}
                            className='flex-1 flex items-center justify-center space-x-2'
                        >
                            <Video className='h-4 w-4' />
                            <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
                        </Button>
                        <Button
                            variant={isAudioEnabled ? 'default' : 'secondary'}
                            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                            className='flex items-center justify-center space-x-2'
                        >
                            <Volume2 className='h-4 w-4' />
                            <span>{isAudioEnabled ? 'Audio On' : 'Audio Off'}</span>
                        </Button>
                    </div>
                    <div className='text-sm text-muted-foreground'>Press Alt + R to start/stop recording</div>
                </div>
            </CardContent>
        </Card>
    );
};

export default RecordingSection;
