import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Search, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
    visibility: z.enum(['all', 'public', 'private']),
    type: z.enum(['all', 'owner', 'public', 'private', 'member']),
    sort: z.enum(['created', 'updated', 'pushed', 'full_name']),
    direction: z.enum(['asc', 'desc']),
    per_page: z.number().min(1).max(100),
    page: z.number().min(1),
    since: z.date().optional(),
    before: z.date().optional(),
});

export type SearchFilters = z.infer<typeof formSchema>;

interface SearchFiltersProps {
    onFiltersChange: (filters: SearchFilters) => void;
    initialFilters?: Partial<SearchFilters>;
    className?: string;
}

export default function SearchComponent({
    onFiltersChange,
    initialFilters = {},
    className = '',
}: SearchFiltersProps) {
    const form = useForm<SearchFilters>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            visibility: 'all',
            type: 'all',
            sort: 'full_name',
            direction: 'asc',
            per_page: 30,
            page: 1,
            since: new Date(),
            before: new Date(),
            ...initialFilters,
        },
    });

    function onSubmit(values: SearchFilters) {
        onFiltersChange(values);
    }

    return (
        <Card className={`w-full max-w-4xl mx-auto ${className}`}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Repository Search
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="grid gap-6 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="visibility"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Visibility</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select visibility" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    All
                                                </SelectItem>
                                                <SelectItem value="public">
                                                    Public
                                                </SelectItem>
                                                <SelectItem value="private">
                                                    Private
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    All
                                                </SelectItem>
                                                <SelectItem value="owner">
                                                    Owner
                                                </SelectItem>
                                                <SelectItem value="public">
                                                    Public
                                                </SelectItem>
                                                <SelectItem value="private">
                                                    Private
                                                </SelectItem>
                                                <SelectItem value="member">
                                                    Member
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="sort"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sort</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select sort" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="created">
                                                    Created
                                                </SelectItem>
                                                <SelectItem value="updated">
                                                    Updated
                                                </SelectItem>
                                                <SelectItem value="pushed">
                                                    Pushed
                                                </SelectItem>
                                                <SelectItem value="full_name">
                                                    Full Name
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="direction"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Direction</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select direction" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="asc">
                                                    Ascending
                                                </SelectItem>
                                                <SelectItem value="desc">
                                                    Descending
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="per_page"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Results Per Page: {field.value}
                                        </FormLabel>
                                        <FormControl>
                                            <Slider
                                                min={1}
                                                max={100}
                                                step={1}
                                                value={[field.value]}
                                                onValueChange={(value) =>
                                                    field.onChange(value[0])
                                                }
                                                className="pt-2"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="page"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Page Number: {field.value}
                                        </FormLabel>
                                        <FormControl>
                                            <Slider
                                                min={1}
                                                max={50}
                                                step={1}
                                                value={[field.value]}
                                                onValueChange={(value) =>
                                                    field.onChange(value[0])
                                                }
                                                className="pt-2"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="since"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Since</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={`w-full pl-3 text-left font-normal ${
                                                            !field.value &&
                                                            'text-muted-foreground'
                                                        }`}
                                                    >
                                                        {field.value ? (
                                                            format(
                                                                field.value,
                                                                'PPP',
                                                            )
                                                        ) : (
                                                            <span>
                                                                Pick a date
                                                            </span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date > new Date() ||
                                                        date <
                                                            new Date(
                                                                '1900-01-01',
                                                            )
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="before"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Before</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={`w-full pl-3 text-left font-normal ${
                                                            !field.value &&
                                                            'text-muted-foreground'
                                                        }`}
                                                    >
                                                        {field.value ? (
                                                            format(
                                                                field.value,
                                                                'PPP',
                                                            )
                                                        ) : (
                                                            <span>
                                                                Pick a date
                                                            </span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date > new Date() ||
                                                        date <
                                                            new Date(
                                                                '1900-01-01',
                                                            )
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            <Search className="mr-2 h-4 w-4" />
                            Search Repositories
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
