// src/modules/installment/components/installment-balance.tsx
interface InstallmentBalanceProps {
  totalPrice: number;
  downPayment: number;
  totalPaid: number;
  remaining: number;
  isFullyPaid: boolean;
}

function formatBDT(amount: number) {
  return `৳${amount.toLocaleString('bn-BD')}`;
}

export function InstallmentBalance({
  totalPrice,
  downPayment,
  totalPaid,
  remaining,
  isFullyPaid,
}: InstallmentBalanceProps) {
  const progressPct = Math.min(
    Math.round(((downPayment + totalPaid) / totalPrice) * 100),
    100
  );

  return (
    <div className="rounded-lg border bg-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">মোট মূল্য</span>
        <span className="font-semibold">{formatBDT(totalPrice)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">ডাউন পেমেন্ট</span>
        <span className="font-semibold">{formatBDT(downPayment)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">পরিশোধিত কিস্তি</span>
        <span className="font-semibold">{formatBDT(totalPaid)}</span>
      </div>

      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex items-center justify-between pt-2 border-t">
        <span className="font-medium">বাকি আছে</span>
        <span className={isFullyPaid ? "text-green-600 font-bold" : "text-destructive font-bold"}>
          {isFullyPaid ? "সম্পূর্ণ পরিশোধিত" : formatBDT(remaining)}
        </span>
      </div>
    </div>
  );
}