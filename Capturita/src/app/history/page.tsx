'use client';

import { SideNav } from '@/components/side-nav';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Video } from '@/model/video';
import { getVideo } from '@/utils/supabase';
import ky from 'ky';
import { FileVideo, Clock, Calendar, Monitor, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export const History = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchingVideos, setFetchingVideos] = useState(false);

    useEffect(() => {
        const fetchVideos = async () => {
            setFetchingVideos(true);
            const response = await ky.get<{ videos: Video[] }>('/api/videos').json();
            setVideos(response.videos);
            setFetchingVideos(false);
        };
        fetchVideos();
    }, []);

    const handleVideoClick = async (video: Video) => {
        setSelectedVideo(video);
        setIsLoading(true);
        setVideoBlob(null);
        try {
            const blob = await getVideo(video.path);
            setVideoBlob(blob);
        } catch (error) {
            console.error('Error loading video:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className='mb-8'>
            <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                    <Monitor className='h-6 w-6' />
                    <span>Recording History</span>
                </CardTitle>
            </CardHeader>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                {fetchingVideos ? (
                    <div className='flex flex-row min-h-screen items-center justify-center'>
                        <Loader2 className='animate-spin' />
                    </div>
                ) : (
                    <>
                        {videos.map((video) => (
                            <CardContent key={video.id}>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Card className='cursor-pointer hover:shadow-lg transition-shadow' onClick={() => handleVideoClick(video)}>
                                            <CardHeader>
                                                <CardTitle className='text-lg'>Video</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className='aspect-video bg-gray-200 rounded-md flex items-center justify-center'>
                                                    <FileVideo className='w-12 h-12 text-gray-400' />
                                                </div>
                                            </CardContent>
                                            <CardFooter className='text-sm text-muted-foreground'>
                                                <div className='flex items-center space-x-2'>
                                                    <Clock className='w-4 h-4' />
                                                    <span>{video.createdAt}</span>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    </DialogTrigger>
                                    <DialogContent className='sm:max-w-[800px]'>
                                        <DialogHeader>
                                            <DialogTitle>Video</DialogTitle>
                                        </DialogHeader>
                                        <div className='mt-4 flex'>
                                            <div className='w-4/5 pr-4'>
                                                {isLoading ? (
                                                    <div className='aspect-video bg-gray-200 rounded-md flex items-center justify-center'>
                                                        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
                                                    </div>
                                                ) : videoBlob ? (
                                                    <video
                                                        src={URL.createObjectURL(videoBlob)}
                                                        controls
                                                        className='w-full rounded-md'
                                                        preload='metadata'
                                                    >
                                                        Your browser does not support the video tag.
                                                    </video>
                                                ) : (
                                                    <div className='aspect-video bg-gray-200 rounded-md flex items-center justify-center'>
                                                        <FileVideo className='w-12 h-12 text-gray-400' />
                                                    </div>
                                                )}
                                            </div>
                                            <div className='w-1/5'>
                                                <div className='space-y-4'>
                                                    <div className='flex items-center space-x-2'>
                                                        <Calendar className='w-5 h-5 text-muted-foreground' />
                                                        <span>Created: {selectedVideo?.createdAt}</span>
                                                    </div>
                                                    <p className='text-sm text-muted-foreground'>
                                                        This is a placeholder for additional video details. In a real application, you would include
                                                        more information about the video, such as description, tags, views, likes, etc.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        ))}
                    </>
                )}
            </div>
        </Card>
    );
};

export default function Component() {
    return (
        <SideNav>
            <div className='d-flex flex-col w-full mx-auto p-4'>
                <History />
            </div>
        </SideNav>
    );
}
