import type { DashboardStatItem } from "../dashboard.types";
import DashboardStatCard from "./stats";

export default function DashboardStatsGrid({ stats }: { stats: DashboardStatItem[] | undefined}) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.isArray(stats) && stats.length > 0 ? (
                stats.map((stat) => (
                    <DashboardStatCard key={stat.name} {...stat} />
                ))
            ) : (
                <p className="col-span-full text-sm text-muted-foreground">
                    Metrics array is temporarily unavailable.
                </p>
            )}
        </div>
    )
}