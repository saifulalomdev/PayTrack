// src/modules/dashboard/components/daily-collections-table.tsx

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, Receipt, ChevronLeft, ChevronRight } from "lucide-react";

export interface DailyCollection {
  date: string;
  totalCollected: number;
}

interface DailyCollectionsTableProps {
  collections: DailyCollection[];
  currentPage: number;
  totalPages: number;
  limit: number;
  errorMsg?: string;
}

function formatUSD(amount: number) {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function DailyCollectionsTable({
  collections,
  currentPage,
  totalPages,
  limit,
  errorMsg,
}: DailyCollectionsTableProps) {
  const isEmpty = !collections || collections.length === 0;
  const daysCount = collections?.length || 0;

  const pageTotal = collections.reduce(
    (sum, item) => sum + item.totalCollected,
    0
  );

  const getPageUrl = (page: number) => {
    return `?page=${page}&limit=${limit}`;
  };

  if (errorMsg) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
        <p className="text-destructive text-sm font-medium">{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card shadow-sm space-y-2 mt-4 md:mt-6 lg:mt-10">
      {/* Header */}
      <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-lg">Daily Collections</h3>
        </div>

        {!isEmpty && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-lg text-sm font-medium">
            <span>Total for {daysCount} days:</span>
            <span className="font-bold text-base text-emerald-700 dark:text-emerald-400">
              {formatUSD(pageTotal)}
            </span>
          </div>
        )}
      </div>

      {/* Main Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Total Collected</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isEmpty ? (
            <TableRow>
              <TableCell colSpan={3} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Receipt className="w-8 h-8 opacity-60" />
                  <p className="text-sm font-medium">No collection records found.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            collections.map((item) => (
              <TableRow key={item.date}>
                <TableCell className="font-medium">
                  {formatDate(item.date)}
                </TableCell>
                <TableCell className="font-bold text-emerald-600 dark:text-emerald-400">
                  {formatUSD(item.totalCollected)}
                </TableCell>
                <TableCell className="text-right">
                  <a href={`/collections/${item.date}`}>
                    <Button variant="ghost" size="icon" title="View details">
                      <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </Button>
                  </a>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination Footer */}
      <div className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground text-center sm:text-left">
          Page <span className="font-semibold text-foreground">{currentPage}</span> of {totalPages}
        </p>

        <div className="flex items-center gap-2">
          {currentPage > 1 ? (
            <a href={getPageUrl(currentPage - 1)}>
              <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
            </a>
          ) : (
            <Button variant="outline" size="sm" disabled className="h-8 px-3 text-xs">
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
          )}

          {currentPage < totalPages ? (
            <a href={getPageUrl(currentPage + 1)}>
              <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </a>
          ) : (
            <Button variant="outline" size="sm" disabled className="h-8 px-3 text-xs">
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}