import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

// Define a type for the incoming data point objects
export interface TrafficTrendDataPoint {
  date: string;
  traffic: number;
}

interface TrafficTrendsChartProps {
  data: TrafficTrendDataPoint[];
  title?: string;
  description?: string;
  trendPercentage?: string;
  className?: string
}

const chartConfig = {
  traffic: {
    label: "Hits",
    color: "currentColor",
  },
} satisfies ChartConfig

export function TrafficTrendsChart({
  data = [],
  title = "Traffic Trends",
  description = "Showing total hits across the chosen period",
  className
}: TrafficTrendsChartProps) {
  return (
    <Card className={className}>
      <CardHeader className="border-b border-black pb-4 mb-4">
        <CardTitle className="text-md font-bold uppercase tracking-tight">{title}</CardTitle>
        <CardDescription className="text-muted-foreground text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-50 items-center justify-center border border-dashed border-black/20 text-muted-foreground">
            NO DATAPOINTS AVAILABLE FOR TIMELINE RANGE
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-50 w-full">
            <BarChart accessibilityLayer data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis
                dataKey="date"
                tickLine={true}
                tickMargin={8}
                axisLine={true}
                className="text-[10px] font-mono"
                tickFormatter={(value) => String(value)}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel  />}/>
              <Bar 
                dataKey="traffic" 
                fill="var(--color-traffic, #2563eb)" 
                className="fill-primary"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 border-t border-black/10 pt-4 mt-2 text-[11px]">
        <div className="leading-none text-muted-foreground">
          Live streaming data point indicators
        </div>
      </CardFooter>
    </Card>
  )
}