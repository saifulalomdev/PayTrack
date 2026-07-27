"use client"

import * as React from "react"
import { Globe, ArrowUpRight, type LucideIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getFaviconSource } from "../dashboard.libs"

// Map string names from your utility to actual Lucide component references
const IconMap: Record<string, LucideIcon> = {
  Globe: Globe,
  ArrowUpRight: ArrowUpRight,
}

interface ReferrerItem {
  name: string // e.g., "github.com", "t.co", "Direct"
  visitors: number
}

interface ReferrerListProps {
  data?: ReferrerItem[]
}

export function DashboardReferrerList({ data = [] }: ReferrerListProps) {
  const totalVisitors = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + (curr.visitors || 0), 0)
  }, [data])

  // Sort referrers by highest impact volume
  const sortedData = React.useMemo(() => {
    return [...data].sort((a, b) => b.visitors - a.visitors)
  }, [data])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="font-mono text-md font-bold uppercase tracking-tight">
            Top Referrers
          </CardTitle>
          <CardDescription className="font-mono text-xs">
            Where your inbound traffic is arriving from
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedData.length === 0 ? (
          <div className="h-[150px] flex items-center justify-center font-mono text-xs text-muted-foreground">
            No referral sources recorded.
          </div>
        ) : (
          sortedData.map((item) => {
            const percentage = totalVisitors > 0 ? (item.visitors / totalVisitors) * 100 : 0
            const isDirect = item.name.toLowerCase() === "direct"
            
            // Utilize your helper function here
            const favicon = getFaviconSource(item.name)
            const IconComponent = favicon.type === 'icon' ? IconMap[favicon.value] || Globe : null

            return (
              <div key={item.name} className="relative group flex items-center h-9 w-full overflow-hidden border border-black/10 px-3">
                {/* Background Brutalist progress marker bar indicator */}
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-muted/60 z-0 transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                />
                
                {/* Foreground interactive metric data content wrapper */}
                <div className="relative z-10 w-full flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2 truncate pr-4">
                    {favicon.type === 'icon' && IconComponent ? (
                      <IconComponent className="h-4 w-4 text-muted-foreground stroke-[1.5]" />
                    ) : (
                      <img 
                        src={favicon.value} 
                        alt=""
                        onError={(e) => {
                          // Fallback if domain icon fails to fetch
                          (e.target as HTMLElement).style.display = "none"
                        }}
                        className="h-4 w-4 object-contain rounded-sm"
                      />
                    )}
                    <span className="font-bold truncate hover:underline cursor-pointer flex items-center gap-1">
                      {item.name}
                      {!isDirect && <ArrowUpRight className="h-3 w-3 inline opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 font-semibold shrink-0">
                    <span>{item.visitors.toLocaleString()}</span>
                    <span className="text-muted-foreground text-[10px] w-10 text-right">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}