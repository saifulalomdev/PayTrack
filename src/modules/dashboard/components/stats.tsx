import { Target, Timer, Undo, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DashboardStatItem } from '../dashboard.types'

export default function DashboardStatCard({ name, value, changes }: DashboardStatItem) {
    const numericChange = parseFloat(changes || "0");

    return (
        <Card key={name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {name === "avgSessionDuration" && "Avg. Session Duration"}
                    {name === "totalTraffic" && "Total Traffic"}
                    {name === "conversionRate" && "Conversion Rate"}
                    {name === "bounceRate" && "Bounce Rate"}
                </CardTitle>
                {name === "avgSessionDuration" && <Timer size={20} />}
                {name === "totalTraffic" && <Users size={20} />}
                {name === "conversionRate" && <Target size={20} />}
                {name === "bounceRate" && <Undo className='rotate-180' size={20} />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value ? value : "--"}</div>
                <p className={`text-xs mt-1 font-medium ${numericChange > 0 ? "text-green-400" : "text-red-400"}`}>
                    {changes} <span className="text-muted-foreground">from last period</span>
                </p>
            </CardContent>
        </Card >
    )
}
