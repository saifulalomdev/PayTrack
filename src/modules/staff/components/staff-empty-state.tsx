import { Button } from "@/components/ui/button";
import { UserPlus, Users } from "lucide-react";

interface StaffEmptyStateProps {
  onAddStaff?: () => void;
}

export default function StaffEmptyState({ onAddStaff }: StaffEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center bg-card/50">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
        <Users className="h-8 w-8" />
      </div>

      <h3 className="text-lg font-semibold text-foreground">No staff members found</h3>
      
      <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-xs">
        You have not added any staff members yet. Get started by adding your first one.
      </p>

      {onAddStaff && (
        <Button onClick={onAddStaff} className="gap-2">
          <UserPlus className="h-4 w-4" />
          <span>Add Staff Member</span>
        </Button>
      )}
    </div>
  );
}