import { z } from 'zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    X,
    Plus,
    DollarSign,
    Clock,
    Terminal,
    FileText,
    ListChecks,
    Eye,
} from 'lucide-react';

interface Bounty {
    id: number;
    title: string;
    bounty: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    timeEstimate: '1-2 days' | '3-5 days' | '1 week' | '2 weeks' | '1 month';
    status: string;
    tags: string[];
    description: string;
    requirements: string[];
    submissions: number;
    watchers: number;
    createdBy: string;
    createdAt: string;
}

const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    bounty: z.number().min(1, 'Bounty amount must be greater than 0'),
    difficulty: z.enum(['Easy', 'Medium', 'Hard'], {
        required_error: 'Please select a difficulty level',
    }),
    timeEstimate: z.enum(
        ['1-2 days', '3-5 days', '1 week', '2 weeks', '1 month'],
        {
            required_error: 'Please select a time estimate',
        },
    ),
    requirements: z
        .array(z.string())
        .min(1, 'At least one requirement is needed'),
    tags: z.array(z.string()).min(1, 'At least one tag is required'),
});

type FormData = z.infer<typeof formSchema>;

interface BountyCreationFormProps {
    onClose: () => void;
    onSubmit: (bounty: Bounty) => void;
    existingBounty?: Bounty | null;
    repo: string;
}

export const BountyCreationForm: React.FC<BountyCreationFormProps> = ({
    onClose,
    onSubmit,
    existingBounty = null,
    repo,
}) => {
    const [currentTag, setCurrentTag] = useState('');
    const [activeTab, setActiveTab] = useState('details');

    const defaultValues: Partial<FormData> = {
        title: existingBounty?.title || '',
        description: existingBounty?.description || '',
        bounty: existingBounty?.bounty || 10,
        difficulty: existingBounty?.difficulty || 'Easy',
        timeEstimate: existingBounty?.timeEstimate || '1-2 days',
        requirements: existingBounty?.requirements || [''],
        tags: existingBounty?.tags || [],
    };

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues,
        mode: 'onChange',
    });

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid },
    } = form;

    const requirements = watch('requirements');
    const tags = watch('tags');

    const addRequirement = () => {
        setValue('requirements', [...requirements, '']);
    };

    const removeRequirement = (index: number) => {
        if (requirements.length > 1) {
            setValue(
                'requirements',
                requirements.filter((_, i) => i !== index),
            );
        }
    };

    const addTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && currentTag.trim()) {
            e.preventDefault();
            if (!tags.includes(currentTag.trim())) {
                setValue('tags', [...tags, currentTag.trim()]);
            }
            setCurrentTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setValue(
            'tags',
            tags.filter((tag) => tag !== tagToRemove),
        );
    };

    const onSubmitForm = (data: FormData) => {
        const bountyData: Bounty = {
            id: existingBounty?.id || Date.now(),
            ...data,
            status: existingBounty?.status || 'open',
            submissions: existingBounty?.submissions || 0,
            watchers: existingBounty?.watchers || 0,
            createdBy: existingBounty?.createdBy || 'Current User',
            createdAt: existingBounty?.createdAt || new Date().toISOString(),
        };
        onSubmit(bountyData);
        onClose();
    };
    const isTabValid = (tabName: string): boolean => {
        switch (tabName) {
            case 'details':
                return (
                    !errors.title &&
                    !errors.description &&
                    !errors.bounty &&
                    !errors.difficulty &&
                    !errors.timeEstimate
                );
            case 'additional':
                return (
                    !errors.requirements &&
                    requirements.some((req) => req.trim())
                );
            case 'preview':
                return isValid;
            default:
                return false;
        }
    };

    return (
        <ScrollArea className="h-[80vh]">
            <form
                onSubmit={handleSubmit(onSubmitForm)}
                className="space-y-6 p-6"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">
                        {existingBounty ? 'Edit Bounty' : 'Create New Bounty'}
                    </h2>
                </div>

                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger
                            value="details"
                            className="flex items-center gap-2"
                            data-valid={isTabValid('details')}
                        >
                            <FileText className="h-4 w-4" />
                            Details
                        </TabsTrigger>
                        <TabsTrigger
                            value="additional"
                            className="flex items-center gap-2"
                            data-valid={isTabValid('additional')}
                        >
                            <ListChecks className="h-4 w-4" />
                            Additional Info
                        </TabsTrigger>
                        <TabsTrigger
                            value="preview"
                            className="flex items-center gap-2"
                            data-valid={isTabValid('preview')}
                        >
                            <Eye className="h-4 w-4" />
                            Preview
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">
                                    Bounty Title
                                </label>
                                <Input
                                    {...register('title')}
                                    placeholder="Enter a clear, descriptive title"
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.title.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">
                                    Description
                                </label>
                                <Textarea
                                    {...register('description')}
                                    placeholder="Describe the issue and what needs to be done"
                                    className="h-32"
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Bounty Amount ($)
                                    </label>
                                    <Input
                                        type="number"
                                        {...register('bounty', {
                                            valueAsNumber: true,
                                        })}
                                        placeholder="Enter amount"
                                    />
                                    {errors.bounty && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {errors.bounty.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Difficulty
                                    </label>
                                    <Select
                                        onValueChange={(value) =>
                                            setValue(
                                                'difficulty',
                                                value as FormData['difficulty'],
                                            )
                                        }
                                        value={watch('difficulty')}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select difficulty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Easy">
                                                Easy
                                            </SelectItem>
                                            <SelectItem value="Medium">
                                                Medium
                                            </SelectItem>
                                            <SelectItem value="Hard">
                                                Hard
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.difficulty && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {errors.difficulty.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Time Estimate
                                    </label>
                                    <Select
                                        onValueChange={(value) =>
                                            setValue(
                                                'timeEstimate',
                                                value as FormData['timeEstimate'],
                                            )
                                        }
                                        value={watch('timeEstimate')}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select time" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1-2 days">
                                                1-2 days
                                            </SelectItem>
                                            <SelectItem value="3-5 days">
                                                3-5 days
                                            </SelectItem>
                                            <SelectItem value="1 week">
                                                1 week
                                            </SelectItem>
                                            <SelectItem value="2 weeks">
                                                2 weeks
                                            </SelectItem>
                                            <SelectItem value="1 month">
                                                1 month
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.timeEstimate && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {errors.timeEstimate.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="additional" className="space-y-4">
                        <div className="space-y-2">
                            {requirements.map((_, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        {...register(`requirements.${index}`)}
                                        placeholder="Add a requirement"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => removeRequirement(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addRequirement}
                                className="w-full"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Requirement
                            </Button>
                            {errors.requirements && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.requirements.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Input
                                placeholder="Add tags (press Enter)"
                                value={currentTag}
                                onChange={(e) => setCurrentTag(e.target.value)}
                                onKeyDown={addTag}
                            />
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        className="flex items-center gap-1"
                                    >
                                        {tag}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => removeTag(tag)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                            {errors.tags && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.tags.message}
                                </p>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="preview">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm text-muted-foreground">
                                                {repo}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">
                                            {watch('title') ||
                                                'Untitled Bounty'}
                                        </h3>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {tags.map((tag) => (
                                                <Badge key={tag}>{tag}</Badge>
                                            ))}
                                        </div>
                                        <div className="flex gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="h-4 w-4" />
                                                ${watch('bounty')}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {watch('timeEstimate')}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Terminal className="h-4 w-4" />
                                                {watch('difficulty')}
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <h4 className="font-semibold mb-2">
                                                Description
                                            </h4>
                                            <p className="text-muted-foreground">
                                                {watch('description')}
                                            </p>
                                        </div>

                                        <div className="mt-6">
                                            <h4 className="font-semibold mb-2">
                                                Requirements
                                            </h4>
                                            <ul className="list-disc list-inside space-y-2">
                                                {requirements
                                                    .filter((req) => req.trim())
                                                    .map((req, index) => (
                                                        <li
                                                            key={index}
                                                            className="text-muted-foreground"
                                                        >
                                                            {req}
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
                <div className="flex justify-end">
                    <Button
                        className="w-full"
                        type="submit"
                        disabled={!isValid}
                    >
                        {existingBounty ? 'Update' : 'Create'}
                    </Button>
                </div>
            </form>
        </ScrollArea>
    );
};
