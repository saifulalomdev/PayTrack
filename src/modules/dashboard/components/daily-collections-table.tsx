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
      {/* Table Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-lg">দৈনিক কালেকশন (Daily Collections)</h3>
        </div>
      </div>

      {/* Main Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>তারিখ (Date)</TableHead>
            <TableHead>মোট আদায় (Total Collected)</TableHead>
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
      <div className="p-4 border-t flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          পৃষ্ঠা {currentPage} / {totalPages} (Page {currentPage} of {totalPages})
        </p>

        <div className="flex items-center gap-2">
          {/* Previous Page Link */}
          {currentPage > 1 ? (
            <a href={getPageUrl(currentPage - 1)}>
              <Button variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4 mr-1" /> আগেরটি (Prev)
              </Button>
            </a>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="w-4 h-4 mr-1" /> আগেরটি (Prev)
            </Button>
          )}

          {/* Next Page Link */}
          {currentPage < totalPages ? (
            <a href={getPageUrl(currentPage + 1)}>
              <Button variant="outline" size="sm">
                পরেরটি (Next) <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </a>
          ) : (
            <Button variant="outline" size="sm" disabled>
              পরেরটি (Next) <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}