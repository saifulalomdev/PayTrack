import { LogOut, Menu, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { actions } from "astro:actions";
import {
    AlertDialogDescription,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogCancel,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialog,
} from "@/components/ui/alert-dialog";

interface DashboardHeaderProps {
    onClick: () => void;
    isSidebarOpen: boolean;
}

export function DashboardHeader({ onClick, isSidebarOpen }: DashboardHeaderProps) {
    const { execute: handleLogout, isLoading } = useAction(actions.logout, {
        loadingMessage: "Signing you out safely...",
        successMessage: "Logged out successfully.",
        onSuccess: () => { window.location.href = "/login"; }
    });

    return (
        <nav className="sticky shrink-0 top-0 left-0 z-50 flex h-16 w-full items-center justify-between border-b border-white/10 bg-card/60 p-4 backdrop-blur-md">
            <div className="flex items-center font-bold gap-2 text-foreground">
                Dashboard
            </div>

            {/* RIGHT: ACTIONS */}
            <div className="flex items-center gap-2 md:gap-4">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" disabled={isLoading} className="text-destructive">
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <LogOut className="h-4 w-4" />
                            )}
                            <span>Logout</span>
                        </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent className="border border-white/10 bg-background/95 backdrop-blur-lg max-w-100">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-semibold tracking-tight">
                                End your session?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm text-muted-foreground pt-1">
                                You will need to sign back in to access your secure client tracking pipelines and data views.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter className="mt-4 gap-2">
                            <AlertDialogCancel asChild>
                                <Button
                                    variant="outline"
                                    className="border-white/10 hover:bg-white/5"
                                    disabled={isLoading}
                                >
                                    Stay logged in
                                </Button>
                            </AlertDialogCancel>

                            {/* UX: The actual action button takes immediate focus and clearly represents safety risk */}
                            <Button
                                variant="destructive"
                                onClick={() => handleLogout({})}
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                Log out
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <Button onClick={onClick} variant="outline" size="icon" className="lg:hidden border-white/10">
                    {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
            </div>
        </nav>
    );
}