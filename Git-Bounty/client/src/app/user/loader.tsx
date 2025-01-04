const Skeleton = ({ className }: { className: string }) => (
    <span aria-live="polite" aria-busy="true" className={className}>
        <span className="inline-flex w-full animate-pulse select-none rounded-md bg-gray-300 leading-none"></span>
        <br />
    </span>
);

const SVGSkeleton = ({ className }: { className: string }) => (
    <svg className={className + ' animate-pulse rounded bg-gray-300'} />
);

export default function UserLoader() {
    return (
        <div className="flex justify-center w-full h-full p-10 rounded-lg">
            <div className="container mx-auto p-6 max-w-4xl">
                <div className="flex items-start gap-6 mb-6 rounded-lg border p-4">
                    <span className="relative flex shrink-0 h-24 w-24">
                        <SVGSkeleton className="aspect-square w-full h-full" />
                    </span>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1>
                                <Skeleton className="w-[104px] max-w-full" />
                            </h1>
                            <div className="border px-2.5 py-0.5 transition-colors border-transparent flex items-center gap-1">
                                <Skeleton className="w-[120px] max-w-full" />
                                <SVGSkeleton className="w-[24px] h-[24px]" />
                            </div>
                        </div>
                        <p className="mb-4">
                            <Skeleton className="w-[120px] max-w-full" />
                        </p>
                        <div className="flex gap-4">
                            <div className="border rounded-lg px-2.5 py-0.5 transition-colors flex items-center gap-1">
                                <Skeleton className="w-[104px] max-w-full" />
                                <SVGSkeleton className="w-[24px] h-[24px]" />
                            </div>
                            <div className="border rounded-lg px-2.5 py-0.5 transition-colors flex items-center gap-1">
                                <Skeleton className="w-[160px] max-w-full" />
                                <SVGSkeleton className="w-[24px] h-[24px]" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full rounded-lg border p-4">
                    <div className="h-9 items-center justify-center p-1 grid w-full grid-cols-2 gap-2">
                        <div className="inline-flex items-center justify-center px-3 py-1 border rounded-lg">
                            <Skeleton className="w-[104px] max-w-full" />
                        </div>
                        <div className="inline-flex items-center justify-center px-3 py-1 border rounded-lg">
                            <Skeleton className="w-[96px] max-w-full" />
                        </div>
                    </div>
                    <div className="mt-2 rounded-lg">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="border rounded-lg">
                                <div className="flex flex-col space-y-1.5 p-6">
                                    <h3 className="leading-none tracking-tight">
                                        <Skeleton className="w-[144px] max-w-full" />
                                    </h3>
                                    <p>
                                        <Skeleton className="w-[280px] max-w-full" />
                                    </p>
                                </div>
                                <div className="p-6 pt-0">
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span>
                                                    <Skeleton className="w-[120px] max-w-full" />
                                                </span>
                                                <span>
                                                    <Skeleton className="w-[24px] max-w-full" />
                                                </span>
                                            </div>
                                            <div className="relative h-2 w-full">
                                                <div className="h-full w-full flex-1"></div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2">
                                                <SVGSkeleton className="w-[24px] h-[24px]" />
                                                <div>
                                                    <p>
                                                        <Skeleton className="w-[16px] max-w-full" />
                                                    </p>
                                                    <p>
                                                        <Skeleton className="w-[72px] max-w-full" />
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <SVGSkeleton className="w-[24px] h-[24px]" />
                                                <div>
                                                    <p>
                                                        <Skeleton className="w-[14px] max-w-full" />
                                                    </p>
                                                    <p>
                                                        <Skeleton className="w-[72px] max-w-full" />
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="border rounded-lg">
                                <div className="flex flex-col space-y-1.5 p-6">
                                    <h3 className="leading-none tracking-tight">
                                        <Skeleton className="w-[128px] max-w-full" />
                                    </h3>
                                    <p>
                                        <Skeleton className="w-[216px] max-w-full" />
                                    </p>
                                </div>
                                <div className="p-6 pt-0">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2">
                                                <SVGSkeleton className="w-[24px] h-[24px]" />
                                                <div>
                                                    <p>
                                                        <Skeleton className="w-[56px] max-w-full" />
                                                    </p>
                                                    <p>
                                                        <Skeleton className="w-[88px] max-w-full" />
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <SVGSkeleton className="w-[24px] h-[24px]" />
                                                <div>
                                                    <p>
                                                        <Skeleton className="w-[16px] max-w-full" />
                                                    </p>
                                                    <p>
                                                        <Skeleton className="w-[88px] max-w-full" />
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-2"></div>
                </div>
            </div>
        </div>
    );
}
