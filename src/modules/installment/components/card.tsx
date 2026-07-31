import { Button } from "@/components/ui/button";
import {
  Trash2,
  Pencil,
  MoreVertical,
  Wallet,
  CalendarCheck,
  StickyNote,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { PublicInstallment } from "../installment.types";

interface InstallmentCardProps extends Partial<PublicInstallment> {
  id?: string;
  // Only admins may edit/delete — staff can log payments but never touch
  // them afterward. Defaults to false so it fails safe if ever omitted.
  isAdmin?: boolean;
  onUpdate?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

function formatPaidAt(unix?: number) {
  if (!unix) return "-";
  return new Date(unix * 1000).toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTaka(amount?: number) {
  if (amount === undefined || amount === null) return "-";
  return `৳${amount.toLocaleString("bn-BD")}`;
}

export default function InstallmentCard({
  amount,
  paidAt,
  note,
  createdByName,
  isAdmin = false,
  isDeleting,
  onDelete,
  onUpdate,
}: InstallmentCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <Card className="rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Wallet className="h-5 w-5" />
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-base leading-none text-foreground">
              {formatTaka(amount)}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarCheck className="h-3.5 w-3.5" />
              <span>পরিশোধ করা হয়েছে: {formatPaidAt(paidAt)}</span>
            </div>

            {note && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <StickyNote className="h-3.5 w-3.5" />
                <span>{note}</span>
              </div>
            )}

            {createdByName && (
              <p className="text-[11px] text-muted-foreground/70 pt-1">
                যোগ করেছেন: {createdByName}
              </p>
            )}
          </div>
        </div>

        {/* Actions Dropdown — admin only */}
        {isAdmin && (
          <div className="flex items-center">
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full shrink-0">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">অপশন খুলুন</span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-44" align="end">
                  <DropdownMenuLabel>কিস্তি অ্যাকশন</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={onUpdate} className="gap-2 cursor-pointer">
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                    <span>তথ্য পরিবর্তন করুন</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                      <span>কিস্তি মুছে ফেলুন</span>
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>কিস্তি মুছে ফেলুন</AlertDialogTitle>
                  <AlertDialogDescription>
                    আপনি কি নিশ্চিত যে এই <strong className="text-foreground">{formatTaka(amount)}</strong> কিস্তিটি মুছে ফেলতে চান? এই কাজটি ফিরিয়ে নেওয়া যাবে না।
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>বাতিল</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={(e) => {
                      e.preventDefault();
                      onDelete?.();
                    }}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "মুছে ফেলা হচ্ছে..." : "মুছে ফেলুন"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </Card>
  );
}