// src/components/ui/brand/AppBranding.tsx
import { cn } from "@/lib/utils";

export  function AppBranding({ border}: { border?: boolean }) {
    return (
        <div className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg", border ? "border-2" : "")}>
            <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-white tracking-wider uppercase">
                        TRACKFLOW
                    </span>
                    <span className="text-[9px] bg-white text-black px-1 font-bold uppercase ml-2">
                        v1.0
                    </span>
                </div>
                <p className="text-[9px] text-zinc-400 font-medium tracking-tight mt-0.5 uppercase truncate">
                    DATA YOU ACTUALLY OWN.
                </p>
            </div>
        </div>
    );
}