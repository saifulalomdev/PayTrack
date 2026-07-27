import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SwitchChoiceCard } from "@/components/ui/switch-card";
import type { Site } from "@/db/schema";
import { useEffect, useState } from "react";

interface WebsiteFormProps {
    initialData: Site;
    isLoading?: boolean;
    isDialogOpen?: boolean;
    setIsDialogOpen?: (state: boolean) => void;
    onSubmit: (data: Partial<Site>) => void;
}

export default function WebsiteForm({
    onSubmit,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    initialData
}: WebsiteFormProps) {
    const [site, setSite] = useState<Site>(initialData);

    useEffect(() => {
        if (isDialogOpen) { setSite(initialData) }
    }, [isDialogOpen, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        const { name, value } = e.target;
        setSite(p => ({ ...p, [name]: value }))
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!site.title?.trim() || !site.url?.trim()) return;
        onSubmit(site);
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-106">
                <DialogHeader>
                    <DialogTitle>
                        {site.id ? "Update Website" : "Add New Website"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Website Name</Label>
                        <Input
                            id="title"
                            value={site.title}
                            name="title"
                            onChange={handleChange}
                            disabled={isLoading}
                            placeholder="My Awesome App"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="url">Website URL</Label>
                        <Input
                            id="url"
                            name="url"
                            type="url"
                            value={site.url}
                            onChange={handleChange}
                            disabled={isLoading}
                            placeholder="https://example.com"
                            required
                        />
                    </div>
                    <SwitchChoiceCard
                        name="isActive"
                        title="Active Status"
                        description="Keep this on to record visitor stats. Turn it off if you want to temporarily pause data collection without deleting your site setup." value={site.isActive ?? false}
                        onChange={handleChange}
                    />
                    <DialogFooter className="pt-2">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" className="flex-1">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isLoading} className="flex-1">
                            {isLoading ? "Saving..." : site.id ? "Save Changes" : "Create Site"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
