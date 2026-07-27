// src/modules/dashboard/components/dashboard.devices.tsx
"use client"

import * as React from "react"
import { Monitor, Smartphone, Tablet, Laptop } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { DeviceItem } from "../dashboard.types";


interface DevicesCardProps {
    data?: DeviceItem[];
}

export function DevicesCard({ data = [] }: DevicesCardProps) {
    const totalVisitors = React.useMemo(() => {
        return data.reduce((sum, item) => sum + (item.visitors || 0), 0)
    }, [data])

    // Device map settings to keep rendering neat, safe, and icon-mapped
    const deviceConfig = {
        Desktop: { icon: Monitor, color: "bg-blue-500" },
        Mobile: { icon: Smartphone, color: "bg-emerald-500" },
        Tablet: { icon: Tablet, color: "bg-amber-500" }
    }

    return (
        <Card>
            <CardHeader className="border-b border-black pb-4 font-mono">
                <CardTitle className="text-md font-bold uppercase tracking-tight">Devices</CardTitle>
                <CardDescription className="text-xs">Client viewports used to interact with your nodes</CardDescription>
            </CardHeader>

            <CardContent className="p-4 font-mono flex flex-col gap-5">
                {totalVisitors === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
                        <div className="p-2 border border-black bg-muted">
                            <Laptop className="h-4 w-4 text-muted-foreground stroke-[1.5]" />
                        </div>
                        <p className="text-xs text-muted-foreground">No device insights recorded yet.</p>
                    </div>
                ) : (
                    <>
                        {/* 📊 Segmented Proportional Stacked Progress Bar */}
                        <div className="h-6 w-full flex border-2 border-black rounded-none overflow-hidden bg-zinc-100">
                            {data.map((item) => {
                                const percentage = totalVisitors > 0 ? (item.visitors / totalVisitors) * 100 : 0
                                if (percentage === 0) return null
                                const config = deviceConfig[item.name] || { color: "bg-zinc-400" }

                                return (
                                    <div
                                        key={item.name}
                                        className={`${config.color} h-full border-r last:border-0 border-black transition-all duration-300`}
                                        style={{ width: `${percentage}%` }}
                                        title={`${item.name}: ${percentage.toFixed(1)}%`}
                                    />
                                )
                            })}
                        </div>

                        {/* 🏷️ Micro Legend / Metrics Breakdown Rows */}
                        <div className="flex flex-col gap-2">
                            {data.map((item) => {
                                const percentage = totalVisitors > 0 ? (item.visitors / totalVisitors) * 100 : 0
                                const config = deviceConfig[item.name]
                                const Icon = config?.icon || Monitor

                                return (
                                    <div
                                        key={item.name}
                                        className="flex items-center justify-between text-xs border border-black/5 px-2.5 py-2 transition-colors hover:bg-muted/30"
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            {/* Micro square dot matches bar colors */}
                                            <div className={`h-2.5 w-2.5 border border-black shrink-0 ${config?.color || 'bg-zinc-400'}`} />
                                            <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                            <span className="font-bold text-foreground truncate">{item.name}</span>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0 font-semibold pl-2">
                                            <span className="text-muted-foreground">{item.visitors.toLocaleString()} hits</span>
                                            <span className="text-foreground bg-zinc-100 border border-black px-1.5 py-0.5 text-[10px]">
                                                {percentage.toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}