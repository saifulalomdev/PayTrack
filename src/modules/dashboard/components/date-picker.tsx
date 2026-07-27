import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";
import {
  subHours,
  subDays,
  subMonths,
  startOfDay,
  endOfDay,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { formatDate } from "@/lib/format-date";

interface Props {
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
}

export function DashboardDateRangePicker({ date, onDateChange }: Props) {
  const [open, setOpen] = React.useState(false);
  const [customOpen, setCustomOpen] = React.useState(false);
  const [tempRange, setTempRange] = React.useState<DateRange | undefined>();

  // -----------------------------
  // PRESET HANDLER
  // -----------------------------
  const applyPreset = (preset: string) => {
    const now = new Date();
    let from: Date;
    let to: Date = now;

    switch (preset) {
      case "12h":
        from = subHours(now, 12);
        break;
      case "24h":
        from = subHours(now, 24);
        break;
      case "7d":
        from = subDays(now, 7);
        break;
      case "1m":
        from = subMonths(now, 1);
        break;
      default:
        return;
    }

    onDateChange({ from, to });
    setOpen(false);
  };

  // -----------------------------
  // CALENDAR SAFETY HANDLER
  // -----------------------------
  const handleSelect = (range: DateRange | undefined) => {
    if (!range) {
      setTempRange(undefined);
      return;
    }

    if (range.from && !range.to) {
      setTempRange({
        from: startOfDay(range.from),
        to: endOfDay(range.from),
      });
    } else {
      setTempRange(range);
    }
  };

  // -----------------------------
  // APPLY CUSTOM RANGE
  // -----------------------------
  const applyCustomRange = () => {
    if (tempRange?.from && tempRange?.to) {
      onDateChange(tempRange);
    }
    setCustomOpen(false);
    setOpen(false);
  };

  return (
    <>
      {/* MAIN TRIGGER */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full md:w-auto justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {formatDate(date.from)}{" "}
                  <span className="text-muted-foreground">→</span>{" "}
                  {formatDate(date.to)}
                </>
              ) : (
                formatDate(date.from)
              )
            ) : (
              <span>Select time range</span>
            )}
          </Button>
        </PopoverTrigger>

        {/* POPOVER CONTENT */}
        <PopoverContent className="w-64 p-2 space-y-1" align="end">
          <div className="text-xs font-semibold text-muted-foreground px-2 py-1">
            Quick ranges
          </div>

          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => applyPreset("12h")}
          >
            Last 12 hours
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => applyPreset("24h")}
          >
            Last 24 hours
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => applyPreset("7d")}
          >
            Last 7 days
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => applyPreset("1m")}
          >
            Last 1 month
          </Button>

          <div className="border-t my-2" />

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setTempRange(date);
              setCustomOpen(true);
            }}
          >
            Custom range
          </Button>
        </PopoverContent>
      </Popover>

      {/* CUSTOM RANGE MODAL */}
      <Dialog open={customOpen} onOpenChange={setCustomOpen}>
        <DialogContent className="sm:max-w-70">
          <DialogHeader>
            <DialogTitle>Select custom date range</DialogTitle>
          </DialogHeader>

          {/* <div className="py-4"> */}
          <Calendar
            mode="range"
            selected={tempRange}
            onSelect={handleSelect}
            numberOfMonths={1}
          />
          {/* </div> */}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCustomOpen(false)}
            >
              Cancel
            </Button>

            <Button onClick={applyCustomRange} disabled={!tempRange?.from || !tempRange?.to}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}