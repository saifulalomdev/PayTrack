// src/modules/dashboard/components/daily-details-table.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Receipt, ArrowLeft } from "lucide-react";

export interface CollectionDetail {
  id: string;
  amountPaid: number;
  paidAt: number;
  createdByName: string;
  productName: string;
  customerName: string;
  customerPhone: string | null;
}

interface DailyDetailsTableProps {
  dateStr: string;
  details: CollectionDetail[];
}

function formatBDT(amount: number) {
  return `৳${amount.toLocaleString("bn-BD")}`;
}

function formatTimeBD(unixMs: number) {
  return new Date(unixMs).toLocaleTimeString("bn-BD", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Dhaka",
  });
}

function formatDateBD(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function DailyDetailsTable({ dateStr, details }: DailyDetailsTableProps) {
  const totalAmount = details.reduce((sum, item) => sum + item.amountPaid, 0);
  const isEmpty = details.length === 0;

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <a href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </a>
          <div>
            <h2 className="text-xl font-bold">{formatDateBD(dateStr)} এর বিস্তারিত কালেকশন</h2>
            <p className="text-sm text-muted-foreground">
              মোট আদায় হয়েছে: <span className="font-semibold text-green-600">{formatBDT(totalAmount)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>গ্রাহকের নাম (Customer)</TableHead>
              <TableHead>পণ্য (Product)</TableHead>
              <TableHead>পরিমাণ (Amount)</TableHead>
              <TableHead>গ্রহীতা (Collected By)</TableHead>
              <TableHead className="text-right">সময় (Time)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isEmpty ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Receipt className="w-8 h-8 opacity-60" />
                    <p className="text-sm font-medium">এই তারিখে কোনো কালেকশন পাওয়া যায়নি।</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              details.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div>{item.customerName}</div>
                    {item.customerPhone && (
                      <div className="text-xs text-muted-foreground">{item.customerPhone}</div>
                    )}
                  </TableCell>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell className="font-bold text-green-600">
                    {formatBDT(item.amountPaid)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.createdByName}</TableCell>
                  <TableCell className="text-right">{formatTimeBD(item.paidAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}