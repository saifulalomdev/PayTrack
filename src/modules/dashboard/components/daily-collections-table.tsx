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

function formatBDT(amount: number) {
  return `৳${amount.toLocaleString("bn-BD")}`;
}

function formatDateBD(dateStr: string) {
  if (!dateStr) return "—";
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
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

  // Calculate total money for the displayed days
  const pageTotal = collections.reduce(
    (sum, item) => sum + item.totalCollected,
    0
  );

  // Helper function to generate URL params for page navigation
  const getPageUrl = (page: number) => {
    return `?page=${page}&limit=${limit}`;
  };

  if (errorMsg) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card shadow-sm space-y-2 mt-4 md:mt-6 lg:mt-10">
      {/* Header with clear summary highlight */}
      <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-lg">দৈনিক কালেকশন (Daily Collections)</h3>
        </div>

        {/* Highlighted UX Summary Box */}
        {!isEmpty && (
          <div className="flex items-center gap-2 bg-green-50 text-green-800 border border-green-200 px-3 py-1.5 rounded-lg text-sm font-medium">
            <span>গত {daysCount} দিনের মোট কালেকশন:</span>
            <span className="font-bold text-base text-green-700">
              {formatBDT(pageTotal)}
            </span>
          </div>
        )}
      </div>

      {/* Main Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>তারিখ (Date)</TableHead>
            <TableHead>মোট আদায় (Total Collected)</TableHead>
            <TableHead className="text-right">বিস্তারিত (Details)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isEmpty ? (
            <TableRow>
              <TableCell colSpan={3} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Receipt className="w-8 h-8 opacity-60" />
                  <p className="text-sm font-medium">কোনো কালেকশন রেকর্ড পাওয়া যায়নি।</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            collections.map((item) => (
              <TableRow key={item.date}>
                <TableCell className="font-medium">
                  {formatDateBD(item.date)}
                </TableCell>
                <TableCell className="font-bold text-green-600">
                  {formatBDT(item.totalCollected)}
                </TableCell>
                <TableCell className="text-right">
                  <a href={`/collections/${item.date}`}>
                    <Button variant="ghost" size="icon" title="বিস্তারিত দেখুন">
                      <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </Button>
                  </a>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
{/* URL-based Pagination Footer */}
      <div className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground text-center sm:text-left">
          পৃষ্ঠা <span className="font-semibold text-foreground">{currentPage}</span> / {totalPages}
        </p>

        <div className="flex items-center gap-2">
          {/* Previous Page Link */}
          {currentPage > 1 ? (
            <a href={getPageUrl(currentPage - 1)}>
              <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                <ChevronLeft className="w-4 h-4 mr-1" /> আগেরটি
              </Button>
            </a>
          ) : (
            <Button variant="outline" size="sm" disabled className="h-8 px-3 text-xs">
              <ChevronLeft className="w-4 h-4 mr-1" /> আগেরটি
            </Button>
          )}

          {/* Next Page Link */}
          {currentPage < totalPages ? (
            <a href={getPageUrl(currentPage + 1)}>
              <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                পরেরটি <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </a>
          ) : (
            <Button variant="outline" size="sm" disabled className="h-8 px-3 text-xs">
              পরেরটি <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}