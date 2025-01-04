import React from 'react';
import { Play, Pause, Download, Maximize2, Minimize2, Blocks, Loader } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from './ui/dialog';
import { DialogHeader } from './ui/dialog';
import { Button } from './ui/button';

interface VideoControlsProps {
    isPlaying: boolean;
    isDownloading: boolean;
    isFullscreen: boolean;
    videoFile: File | null;
    onPlayPause: () => void;
    onDownload: () => void;
    onToggleFullscreen: () => void;
}

export const VideoControls = ({
    isPlaying,
    isDownloading,
    isFullscreen,
    videoFile,
    onDownload,
    onPlayPause,
    onToggleFullscreen,
}: VideoControlsProps) => {
    return (
        <div className='flex items-center gap-2 bg-card p-2 rounded-lg shadow-sm'>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant='ghost' size='icon' disabled={!videoFile} className='hover:bg-accent'>
                        <Blocks className='h-4 w-4' />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Integrations</DialogTitle>
                    </DialogHeader>
                    <Accordion type='single' collapsible>
                        <AccordionItem value='drive'>
                            <AccordionTrigger>Connect to Drive</AccordionTrigger>
                            <AccordionContent>
                                <p>Connect your account to Google Drive to easily upload your video.</p>
                                <Button variant='outline' className='mt-2'>
                                    Upload to Drive
                                </Button>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value='youtube'>
                            <AccordionTrigger>Connect to YouTube</AccordionTrigger>
                            <AccordionContent>
                                <p>Link your YouTube account and upload the video directly to your channel.</p>
                                <Button variant='outline' className='mt-2'>
                                    Upload to YouTube
                                </Button>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </DialogContent>
            </Dialog>
            <Button variant='ghost' size='icon' onClick={onToggleFullscreen} disabled={!videoFile} className='hover:bg-accent'>
                {isFullscreen ? <Minimize2 className='h-4 w-4' /> : <Maximize2 className='h-4 w-4' />}
            </Button>

            <Button variant='ghost' size='icon' onClick={onDownload} disabled={!videoFile || isDownloading} className='hover:bg-accent'>
                {isDownloading ? <Loader className='h-4 w-4 animate-spin' /> : <Download className='h-4 w-4' />}
            </Button>
            <Button variant='secondary' size='icon' disabled={!videoFile} onClick={onPlayPause} className='hover:bg-secondary/80'>
                {isPlaying ? <Pause className='h-4 w-4' /> : <Play className='h-4 w-4' />}
            </Button>
        </div>
    );
};
