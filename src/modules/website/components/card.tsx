import { Button } from "@/components/ui/button"
import {
    Play,
    Trash2,
    Pencil,
    MoreVertical,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Site } from '@/db/schema'
import { getBaseUrl } from '@/lib/get-base-url'
import { cn } from '@/lib/utils'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from 'react'
import { WebsiteStatusIcon } from './status-icon';
import CopyToClipboard from '@/components/ui/copy-to-clipboard';
import { Card } from "@/components/ui/card";

interface SiteCardProps extends Site {
    onUpdate?: () => void;
    onDelete?: () => void;
    onTest?: () => void;
    isDeleting?: boolean;
}

export default function SiteCard({
    id,
    url,
    title,
    isActive,
    isDeleting,
    onTest,
    onDelete,
    onUpdate,
}: SiteCardProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const scriptUrl = `${getBaseUrl()}/script.js`;
    const apiEndPoint = `${getBaseUrl()}/api/events`;
    const trackingScript = `<script async defer src="${scriptUrl}" data-website-id="${id}" data-api="${apiEndPoint}"/>`;

    return (
        <Card key={id} className="rounded-lg justify-between gap-6 p-6 flex flex-col md:flex-row items-center">
            <div className="flex items-center gap-4 w-full md:w-auto">
            <WebsiteStatusIcon isActive={isActive}/>

                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg tracking-tight">{title}</h3>
                        <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full font-medium",
                            isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                        )}>
                            {isActive ? "Active" : "No Data Yet"}
                        </span>
                    </div>
                    <a href={url} target='_blank' rel="noopener noreferrer" className="text-sm opacity-60 hover:opacity-100 transition-opacity underline block mt-0.5">
                        {url}
                    </a>
                </div>
            </div>

            {/* Site actions */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <CopyToClipboard
                    title="Copy script"
                    data={trackingScript}
                    successMessage="Tracking script copied to clipboard!"
                    errorMessage="Failed to copy script. Please try again."
                />

                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open options</span>
                            </Button>
                        </DropdownMenuTrigger>
                        
                        <DropdownMenuContent className="w-48" align="end">
                            <DropdownMenuLabel>Site Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem onClick={onTest} className="gap-2 cursor-pointer">
                                <Play className="w-4 h-4 text-muted-foreground" />
                                <span>Test Connection</span>
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem onClick={onUpdate} className="gap-2 cursor-pointer">
                                <Pencil className="h-4 w-4 text-muted-foreground" />
                                <span>Edit Details</span>
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem 
                                    className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span>Delete Site</span>
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete <strong className='font-bold text-destructive text-2xl'>{title}</strong> and remove all historical event metrics from your servers. This configuration cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                                variant="destructive" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    onDelete?.();
                                }}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Yes, Delete Site"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </Card>
    )
}