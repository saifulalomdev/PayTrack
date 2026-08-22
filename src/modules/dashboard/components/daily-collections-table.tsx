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
import type { Language } from "@/utils/i18n";

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
  lang: Language;
  t: (key: string) => string;
}

function formatBDT(amount: number) {
  return `Tk ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(dateStr: string, lang: Language) {
  if (!dateStr) return "—";
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const locale = lang === "bn" ? "bn-BD" : "en-US";
  return date.toLocaleDateString(locale, {
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
  lang,
  t,
}: DailyCollectionsTableProps) {
  const isEmpty = !collections || collections.length === 0;
  const daysCount = collections?.length || 0;
  const pageTotal = collections.reduce((sum, item) => sum + item.totalCollected, 0);

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
      <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-lg">{t("dashboard.dailyCollections.title")}</h3>
        </div>

        {!isEmpty && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg text-sm font-medium">
            <span>
              {t("dashboard.dailyCollections.totalFor")} {daysCount} {t("dashboard.dailyCollections.days")}:
            </span>
            <span className="font-bold text-base text-emerald-700">{formatBDT(pageTotal)}</span>
          </div>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("dashboard.dailyCollections.date")}</TableHead>
            <TableHead>{t("dashboard.dailyCollections.totalCollected")}</TableHead>
            <TableHead className="text-right">{t("dashboard.dailyCollections.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isEmpty ? (
            <TableRow>
              <TableCell colSpan={3} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Receipt className="w-8 h-8 opacity-60" />
                  <p className="text-sm font-medium">{t("dashboard.dailyCollections.noRecords")}</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            collections.map((item) => (
              <TableRow key={item.date}>
                <TableCell className="font-medium">{formatDate(item.date, lang)}</TableCell>
                <TableCell className="font-bold text-emerald-600">{formatBDT(item.totalCollected)}</TableCell>
                <TableCell className="text-right">
                  <a href={`/collections/${item.date}`}>
                    <Button variant="ghost" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </a>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {t("dashboard.dailyCollections.pageOf")} <span className="font-semibold">{currentPage}</span> of {totalPages}
        </p>

        <div className="flex items-center gap-2">
          {currentPage > 1 ? (
            <a href={getPageUrl(currentPage - 1)}>
              <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                <ChevronLeft className="w-4 h-4 mr-1" /> {t("dashboard.dailyCollections.previous")}
              </Button>
            </a>
          ) : (
            <Button variant="outline" size="sm" disabled className="h-8 px-3 text-xs">
              <ChevronLeft className="w-4 h-4 mr-1" /> {t("dashboard.dailyCollections.previous")}
            </Button>
          )}

          {currentPage < totalPages ? (
            <a href={getPageUrl(currentPage + 1)}>
              <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                {t("dashboard.dailyCollections.next")} <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </a>
          ) : (
            <Button variant="outline" size="sm" disabled className="h-8 px-3 text-xs">
              {t("dashboard.dailyCollections.next")} <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}