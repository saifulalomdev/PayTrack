import { Button } from "@/components/ui/button";
import {
  Trash2,
  Pencil,
  MoreVertical,
  User,
  Hash,
  Package,
  CalendarClock,
  Wallet,
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
import { PublicCustomer } from "../customer.types";

interface CustomerCardProps extends Partial<PublicCustomer> {
  id?: string;
  // Only admins may edit/delete — staff can add and view customers, but
  // never touch them afterward. Defaults to false so it fails safe if
  // this prop is ever forgotten.
  isAdmin?: boolean;
  onUpdate?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

function formatDeadline(unix?: number) {
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

export default function CustomerCard({
  id,
  name,
  serialNumber,
  productName,
  totalPrice,
  downPayment,
  installmentAmount,
  installmentDeadline,
  createdByName,
  isAdmin = false,
  isDeleting,
  onDelete,
  onUpdate,
}: CustomerCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <Card className="rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        {/* Left Side: Avatar and Customer Info */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-6 w-6" />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-base leading-none text-foreground">
                {name}
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <Hash className="h-3 w-3" />
                {serialNumber}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Package className="h-3.5 w-3.5" />
              <span>{productName}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarClock className="h-3.5 w-3.5" />
              <span>পরবর্তী কিস্তি: {formatDeadline(installmentDeadline)}</span>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
              <span>মোট মূল্য: <strong className="text-foreground">{formatTaka(totalPrice)}</strong></span>
              <span>ডাউন পেমেন্ট: <strong className="text-foreground">{formatTaka(downPayment)}</strong></span>
              <span>কিস্তি: <strong className="text-foreground">{formatTaka(installmentAmount)}</strong></span>
            </div>

            {createdByName && (
              <p className="text-[11px] text-muted-foreground/70 pt-1">
                যোগ করেছেন: {createdByName}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* View installments — open to every staff member, not gated by
              isAdmin, since staff are allowed to add/view payments even
              though they can't edit/delete a customer's own record. */}
          {id && (
            <a href={`/customers/${id}/installments`}>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" title="কিস্তি দেখুন">
                <Wallet className="h-4 w-4" />
                <span className="sr-only">কিস্তি দেখুন</span>
              </Button>
            </a>
          )}

          {/* Edit/Delete Dropdown — admin only */}
          {isAdmin && (
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">অপশন খুলুন</span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-44" align="end">
                  <DropdownMenuLabel>গ্রাহক অ্যাকশন</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={onUpdate} className="gap-2 cursor-pointer">
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                    <span>তথ্য পরিবর্তন করুন</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                      <span>গ্রাহক মুছে ফেলুন</span>
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Delete Confirmation Dialog */}
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>গ্রাহক মুছে ফেলুন</AlertDialogTitle>
                  <AlertDialogDescription>
                    আপনি কি নিশ্চিত যে <strong className="text-foreground">{name}</strong> কে মুছে ফেলতে চান? এই কাজটি ফিরিয়ে নেওয়া যাবে না।
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
          )}
        </div>
      </div>
    </Card>
  );
}