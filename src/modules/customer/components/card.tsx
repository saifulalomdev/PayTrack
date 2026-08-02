import {
  User,
  Hash,
  Package,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { PublicCustomer } from "../customer.types";

interface CustomerCardProps extends Partial<PublicCustomer> {
  id?: string;
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
}: CustomerCardProps) {

  return (
    <a href={`/customers/${id}/installments`}>
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

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
                <span>মোট মূল্য: <strong className="text-foreground">{formatTaka(totalPrice)}</strong></span>
                <span>ডাউন পেমেন্ট: <strong className="text-foreground">{formatTaka(downPayment)}</strong></span>
                <span>কিস্তি: <strong className="text-foreground">{formatTaka(installmentAmount)}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </a>
  );
}