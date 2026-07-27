// src/modules/dashboard/components/dashboard.pageviews.tsx
"use client"

import * as React from "react"
import { ArrowUpRight, FileText } from 'lucide-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import type { PageviewItem } from '../dashboard.types'
import { formatPageTitle, formatPageUrl, formatViews } from '../dashboard.libs'
import { truncateText } from '@/lib/truncate-text'

type PageviewsCardProps = {
    pageviews?: PageviewItem[],
      className?: string
}

export function PageviewsCard({
    pageviews = [],
    className
}: PageviewsCardProps) {
    const topPages = React.useMemo(() => pageviews.slice(0, 5), [pageviews])

    const maxViews = React.useMemo(() => {
        return topPages.length > 0 ? Math.max(...topPages.map(p => Number(p?.views || 0))) : 0
    }, [topPages])

    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
                <div>
                    <CardTitle className="font-mono text-md font-bold uppercase tracking-tight">
                        Top Pages
                    </CardTitle>
                    <CardDescription className="font-mono text-xs">
                        Most active target pages and entry paths
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-2.5">
                {topPages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                        <div className="p-2.5 rounded-none border border-black bg-muted">
                            <FileText className="h-5 w-5 text-muted-foreground stroke-[1.5]" />
                        </div>
                        <p className="font-mono text-xs text-muted-foreground">No page views available yet.</p>
                    </div>
                ) : (
                    topPages.map((page, index) => {
                        const title = formatPageTitle(page?.title) || "Untitled Page"
                        const url = formatPageUrl(page?.url)
                        const rawViews = Number(page?.views || 0)
                        const viewsFormatted = formatViews(page?.views)
                        
                        // Calculate percentage relative to the highest performing page
                        const relativePercentage = maxViews > 0 ? (rawViews / maxViews) * 100 : 0

                        return (
                            <div
                                key={page?.url || index}
                                className="relative group flex items-center h-10 w-full overflow-hidden border border-black/10 px-3 transition-colors hover:border-black/30"
                            >
                                {/* Micro-interaction Progress fill indicator bar */}
                                <div 
                                    className="absolute left-0 top-0 bottom-0 bg-muted/50 z-0 transition-all duration-500 ease-out"
                                    style={{ width: `${relativePercentage}%` }}
                                />
                                
                                {/* Foreground content structured safely layout */}
                                <div className="relative z-10 w-full flex items-center justify-between font-mono text-xs min-w-0">
                                    <div className="min-w-0 flex-1 pr-4 flex flex-col justify-center">
                                        <h3 className="truncate font-bold text-foreground leading-tight">
                                            {truncateText(title, 60)}
                                        </h3>
                                        
                                        {page?.url ? (
                                            <a
                                                href={page.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-0.5 truncate text-[10px] text-muted-foreground transition-colors hover:text-primary hover:underline w-fit"
                                            >
                                                {truncateText(url, 45)}
                                                <ArrowUpRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </a>
                                        ) : (
                                            <span className="text-[10px] text-muted-foreground/50">
                                                No URL tracked
                                            </span>
                                        )}
                                    </div>

                                    <div className="shrink-0 text-right font-semibold font-mono pl-2">
                                        {viewsFormatted}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </CardContent>
        </Card>
    )
}