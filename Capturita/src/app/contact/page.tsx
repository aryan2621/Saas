'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SideNav } from '@/components/side-nav';

const ContactUs = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setName('');
        setEmail('');
        setMessage('');
    };

    return (
        <div className='flex flex-col gap-4'>
            <Card>
                <CardHeader>
                    <CardTitle>Get in Touch</CardTitle>
                    <CardDescription>
                        We&#39;d love to hear from you. Fill out the form below and we&rsquo;ll get back to you as soon as possible.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div>
                            <label htmlFor='name' className='block text-sm font-medium'>
                                Name
                            </label>
                            <Input id='name' type='text' value={name} onChange={(e) => setName(e.target.value)} required className='mt-1' />
                        </div>
                        <div>
                            <label htmlFor='email' className='block text-sm font-medium'>
                                Email
                            </label>
                            <Input id='email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} required className='mt-1' />
                        </div>
                        <div>
                            <label htmlFor='message' className='block text-sm font-medium'>
                                Message
                            </label>
                            <Textarea id='message' value={message} onChange={(e) => setMessage(e.target.value)} required className='mt-1' />
                        </div>
                        <Button type='submit'>Send Message</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>Find quick answers to common questions about our video recording and editing services.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type='single' collapsible className='w-full'>
                        <AccordionItem value='item-1'>
                            <AccordionTrigger>What video formats do you support?</AccordionTrigger>
                            <AccordionContent>
                                We support a wide range of video formats including MP4, AVI, MOV, and WMV. Our platform can handle most common video
                                file types for both input and output.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value='item-2'>
                            <AccordionTrigger>How long does it take to edit a video?</AccordionTrigger>
                            <AccordionContent>
                                The editing time depends on the length and complexity of your video. Simple edits can be done in a few hours, while
                                more complex projects may take several days. We&lsquo;ll provide you with an estimated timeline when you submit your
                                project.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value='item-3'>
                            <AccordionTrigger>Can I collaborate with others on my video project?</AccordionTrigger>
                            <AccordionContent>
                                Yes! Our platform supports team collaboration. You can invite team members or clients to view, comment, and even make
                                edits to your video projects, depending on the permissions you set.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value='item-4'>
                            <AccordionTrigger>What if I&rsquo;m not satisfied with the final edit?</AccordionTrigger>
                            <AccordionContent>
                                We offer revisions to ensure you&lsquo;re completely satisfied with your video. If you&#39;re not happy with the
                                initial edit, simply provide feedback and we&#39;ll make the necessary adjustments at no extra cost.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value='item-5'>
                            <AccordionTrigger>Do you offer video recording services as well?</AccordionTrigger>
                            <AccordionContent>
                                Yes, we provide both recording and editing services. Whether you need help setting up a professional recording
                                environment or want us to handle the entire production process, we&#39;ve got you covered.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
};
export default function Component() {
    return (
        <>
            <SideNav>
                <div className='d-flex flex-col w-full mx-auto p-4'>
                    <ContactUs />
                </div>
            </SideNav>
        </>
    );
}
