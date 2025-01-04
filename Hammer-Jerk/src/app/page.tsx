'use client';

import { Sidebar } from '@/elements/sideBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UploadVideoComponent from '@/elements/uploadVideoComponent';
import { useState } from 'react';
import UploadPDFComponent from '@/elements/uploadPdfComponent';
import AiEditorComponent from '@/elements/aiEditorComponent';
import { FileText, Video } from 'lucide-react';
import { Card, CardDescription, CardTitle, CardHeader, CardContent } from '@/components/ui/card';

export default function Home() {
    const [activeTab, setActiveTab] = useState('video');
    return (
        <>
            <div className="border rounded-2xl w-[96%] mx-auto mt-4 min-h-[calc(100vh-100px)]">
                <div className="grid lg:grid-cols-5">
                    <Sidebar
                        options={['LinkedIn', 'Reddit', 'Google Bloggers', 'Tumblr', 'Google']}
                        className="hidden lg:block min-h-[calc(100vh-100px)]"
                    />
                    <div className="col-span-3 lg:col-span-4 lg:border-l">
                        <div className="h-full px-4 py-6 lg:px-8">
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <div className="flex items-center justify-between mb-4">
                                    <TabsList>
                                        <TabsTrigger value="video" className="flex items-center">
                                            <Video className="mr-2 h-4 w-4" />
                                            Video
                                        </TabsTrigger>
                                        <TabsTrigger value="documents" className="flex items-center">
                                            <FileText className="mr-2 h-4 w-4" />
                                            Documents
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="video">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Video Processing</CardTitle>
                                            <CardDescription>Get your video insights directly from AI</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <UploadVideoComponent />
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="documents">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Documents Processing</CardTitle>
                                            <CardDescription>
                                                Get your documents insights directly from AI
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <UploadPDFComponent />
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="ai">
                                    <AiEditorComponent />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border rounded-2xl w-[96%] mx-auto mt-4 min-h-[calc(100vh-100px)]">
                <AiEditorComponent />
            </div>
        </>
    );
}
