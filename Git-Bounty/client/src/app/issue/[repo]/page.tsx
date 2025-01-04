'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DollarSign,
    Clock,
    Terminal,
    PlusCircle,
    Github,
    MessageSquare,
    Eye,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BasicLayout from '@/layout/basic-layout';
import { Bounty, BountyCreationForm } from '@/element/bounty-form';
import { useSearchParams } from 'next/navigation';
import SearchComponent, {
    SearchIssueFilters,
} from '@/element/issue-search-filters';
import { useQuery } from '@tanstack/react-query';
interface GitHubIssue {
    id: number;
    number: number;
    title: string;
    body: string;
    labels: { name: string }[];
    created_at: string;
    comments: number;
    html_url: string;
}

const fetchIssues = async (
    owner: string,
    repo: string,
    filters: Partial<SearchIssueFilters>,
): Promise<GitHubIssue[]> => {
    const params = new URLSearchParams({
        ...filters,
        owner,
        repo,
    } as unknown as Record<string, string>);

    const response = await fetch(`/api/issues?${params}`);
    if (!response.ok) throw new Error('Failed to fetch issues');
    return response.json();
};

export default function GitHubBounties() {
    const searchParams = useSearchParams();
    const owner = searchParams.get('owner') ?? '';
    const repo = searchParams.get('repo') ?? '';

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [filters, setFilters] = useState<Partial<SearchIssueFilters>>({
        label: '',
        state: 'all',
        sort: 'comments',
    });
    const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null);
    const [bounties, setBounties] = useState<Bounty[]>([]);
    const [selectedIssue, setSelectedIssue] = useState<GitHubIssue | null>(
        null,
    );
    const [activeTab, setActiveTab] = useState('issues');

    const { data: issues, isLoading } = useQuery<GitHubIssue[]>({
        queryKey: ['issues', owner, repo, filters],
        queryFn: () => fetchIssues(owner, repo, filters),
        enabled: !!owner && !!repo,
    });

    const handleCreateBounty = (bountyData: Bounty) => {
        if (selectedBounty) {
            setBounties(
                bounties.map((b) =>
                    b.id === selectedBounty.id ? { ...b, ...bountyData } : b,
                ),
            );
        } else {
            const newBounty = {
                ...bountyData,
                issueId: selectedIssue?.id,
            };
            setBounties([...bounties, newBounty]);
        }
        setIsDialogOpen(false);
        setSelectedBounty(null);
        setSelectedIssue(null);
    };

    const openBountyDialog = (issue: GitHubIssue) => {
        const existingBounty = bounties.find((b) => b.id === issue.id);
        setSelectedIssue(issue);
        setSelectedBounty(existingBounty || null);
        setIsDialogOpen(true);
    };

    const handleFiltersChange = (newFilters: SearchIssueFilters) =>
        setFilters(newFilters);

    if (!repo || !owner) {
        return (
            <BasicLayout>
                <div>Repo not found</div>
            </BasicLayout>
        );
    }
    if (isLoading) {
        return (
            <BasicLayout>
                <div>Loading...</div>
            </BasicLayout>
        );
    }
    return (
        <BasicLayout>
            <SearchComponent
                onFiltersChange={handleFiltersChange}
                initialFilters={filters}
            />
            {isLoading && <div>Loading...</div>}
            {!repo || (!owner && <div>Repo not found</div>)}
            {repo && owner && !isLoading && (
                <>
                    <div className="container mx-auto p-6">
                        <div className="space-y-6">
                            <Tabs
                                value={activeTab}
                                onValueChange={setActiveTab}
                            >
                                <TabsList>
                                    <TabsTrigger value="issues">
                                        Issues
                                    </TabsTrigger>
                                    <TabsTrigger value="bounties">
                                        Bounties
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="issues">
                                    <div className="grid gap-4">
                                        {issues?.length === 0 ? (
                                            <div className="flex justify-center items-center h-full">
                                                <div>No issues found</div>
                                            </div>
                                        ) : (
                                            <>
                                                {issues?.map(
                                                    (issue: GitHubIssue) => (
                                                        <Card key={issue.id}>
                                                            <CardContent className="p-6">
                                                                <div className="flex justify-between items-start">
                                                                    <div className="space-y-2">
                                                                        <div className="flex items-center gap-2">
                                                                            <Github className="h-4 w-4" />
                                                                            <span className="text-sm text-muted-foreground">
                                                                                #
                                                                                {
                                                                                    issue.number
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <h3 className="text-lg font-semibold">
                                                                            {
                                                                                issue.title
                                                                            }
                                                                        </h3>
                                                                        <div className="flex gap-2">
                                                                            {issue.labels.map(
                                                                                (
                                                                                    label,
                                                                                ) => (
                                                                                    <Badge
                                                                                        key={
                                                                                            label.name
                                                                                        }
                                                                                        variant="outline"
                                                                                    >
                                                                                        {
                                                                                            label.name
                                                                                        }
                                                                                    </Badge>
                                                                                ),
                                                                            )}
                                                                        </div>
                                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                                            <div className="flex items-center gap-1">
                                                                                <MessageSquare className="h-4 w-4" />
                                                                                {
                                                                                    issue.comments
                                                                                }{' '}
                                                                                comments
                                                                            </div>
                                                                            <div className="flex items-center gap-1">
                                                                                <Clock className="h-4 w-4" />
                                                                                {new Date(
                                                                                    issue.created_at,
                                                                                ).toLocaleDateString()}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <Button
                                                                        onClick={() =>
                                                                            openBountyDialog(
                                                                                issue,
                                                                            )
                                                                        }
                                                                        variant="outline"
                                                                    >
                                                                        <PlusCircle className="h-4 w-4 mr-2" />
                                                                        {bounties.find(
                                                                            (
                                                                                b,
                                                                            ) =>
                                                                                b.id ===
                                                                                issue.id,
                                                                        )
                                                                            ? 'Edit Bounty'
                                                                            : 'Create Bounty'}
                                                                    </Button>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ),
                                                )}
                                            </>
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="bounties">
                                    <div className="grid gap-4">
                                        {bounties.map((bounty) => (
                                            <Card key={bounty.id}>
                                                <CardContent className="p-6">
                                                    <div className="flex justify-between items-start">
                                                        <div className="space-y-2">
                                                            <h3 className="text-lg font-semibold">
                                                                {bounty.title}
                                                            </h3>
                                                            <div className="flex gap-2">
                                                                {bounty.tags.map(
                                                                    (tag) => (
                                                                        <Badge
                                                                            key={
                                                                                tag
                                                                            }
                                                                            variant="outline"
                                                                        >
                                                                            {
                                                                                tag
                                                                            }
                                                                        </Badge>
                                                                    ),
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-4 text-sm">
                                                                <div className="flex items-center gap-1">
                                                                    <DollarSign className="h-4 w-4" />
                                                                    $
                                                                    {
                                                                        bounty.bounty
                                                                    }
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Terminal className="h-4 w-4" />
                                                                    {
                                                                        bounty.difficulty
                                                                    }
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Eye className="h-4 w-4" />
                                                                    {
                                                                        bounty.watchers
                                                                    }{' '}
                                                                    watching
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            onClick={() => {
                                                                setSelectedBounty(
                                                                    bounty,
                                                                );
                                                                setIsDialogOpen(
                                                                    true,
                                                                );
                                                            }}
                                                            variant="outline"
                                                        >
                                                            Edit Bounty
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>

                        <Dialog
                            open={isDialogOpen}
                            onOpenChange={setIsDialogOpen}
                        >
                            <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                    <DialogTitle>
                                        {selectedBounty
                                            ? 'Edit Bounty'
                                            : 'Create New Bounty'}
                                    </DialogTitle>
                                </DialogHeader>
                                <BountyCreationForm
                                    onClose={() => {
                                        setIsDialogOpen(false);
                                        setSelectedBounty(null);
                                        setSelectedIssue(null);
                                    }}
                                    repo={repo}
                                    onSubmit={handleCreateBounty}
                                    existingBounty={selectedBounty}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>
                </>
            )}
        </BasicLayout>
    );
}
