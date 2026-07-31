import { Button } from "@/components/ui/button";
import { UserPlus, Users } from "lucide-react";


export default function CustomerEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center bg-card/50">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
        <Users className="h-8 w-8" />
      </div>

      <h3 className="text-lg font-semibold text-foreground">কোনো গ্রাহক পাওয়া যায়নি</h3>

      <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-xs">
        আপনি এখনো কোনো গ্রাহক যোগ করেননি। প্রথম গ্রাহক যোগ করে শুরু করুন।
      </p>

      <a href="/customers/new">
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          <span>নতুন গ্রাহক যোগ করুন</span>
        </Button>
      </a>
    </div>
  );
}