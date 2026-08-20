// src/modules/dashboard/components/dashboard-metrics-card.tsx
import type { PublicDashboard } from "../dashboard-types";
import { DollarSign, TrendingUp, Users } from "lucide-react";

interface DashboardMetricsCardProps {
  metrics?: PublicDashboard | null;
  errorMsg?: string;
}

export function DashboardMetricsCard({
  metrics,
  errorMsg,
}: DashboardMetricsCardProps) {
  // Show error state
  if (errorMsg) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">{errorMsg}</p>
      </div>
    );
  }

  // Show empty state
  if (!metrics) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-600 text-sm">No metrics available</p>
      </div>
    );
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Today Collected Card */}
      <div className="bg-muted rounded-lg shadow p-6 border-l-4 border-green-500 hover:shadow-lg transition">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-500 text-sm font-medium">
            Today Collected
          </span>
          <div className="bg-green-100 p-2 rounded-lg">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
        </div>
        <div className="text-3xl font-bold">
          {formatAmount(metrics.todayCollected)}
        </div>
        <p className="text-gray-400 text-xs mt-2">
          Amount collected from customers today
        </p>
      </div>

      {/* Total Investment Remaining Card */}
      <div className="bg-muted rounded-lg shadow p-6 border-l-4 border-orange-500 hover:shadow-lg transition">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-500 text-sm font-medium">
            Investment Remaining
          </span>
          <div className="bg-orange-100 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-orange-600" />
          </div>
        </div>
        <div className="text-3xl font-bold">
          {formatAmount(metrics.totalInvestmentRemaining)}
        </div>
        <p className="text-gray-400 text-xs mt-2">
          Amount customers still owe
        </p>
      </div>

      {/* Total Customers Card */}
      <div className="bg-muted rounded-lg shadow p-6 border-l-4 border-blue-500 hover:shadow-lg transition">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-500 text-sm font-medium">
            Total Customers
          </span>
          <div className="bg-blue-100 p-2 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <div className="text-3xl font-bold">
          {metrics.totalCustomers}
        </div>
        <p className="text-gray-400 text-xs mt-2">
          Active customers in system
        </p>
      </div>
    </div>
  );
}