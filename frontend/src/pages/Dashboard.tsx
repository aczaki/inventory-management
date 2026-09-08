import { useCallback, useEffect, useState } from "react";

import StatCard from "../components/dashboard/StatCard";
import StockMovementChart from "../components/dashboard/StockMovementChart";
import WarehouseStockChart from "../components/dashboard/WarehouseStockChart";
import LowStockTable from "../components/dashboard/LowStockTable";
import RecentTransactions from "../components/dashboard/RecentTransactions";

import { getDashboard } from "../services/dashboardService";
import type { DashboardData } from "../types/dashboard";

function ProductsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7.5 12 3l9 4.5M3 7.5 12 12m0 0 9-4.5M12 12v9M3 7.5V16l9 5 9-5V7.5"
      />
    </svg>
  );
}

function StockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 19V5m0 14 4-4 4 3 8-9"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 9h4v4"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v4"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 17h.01"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m10.3 4.7-7.1 12.1A2 2 0 0 0 4.9 20h14.2a2 2 0 0 0 1.7-3.2L13.7 4.7a2 2 0 0 0-3.4 0Z"
      />
    </svg>
  );
}

function WarehouseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 10 12 3l9 7v10H3V10Z"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 21v-7h10v7M9 10h6"
      />
    </svg>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-40 animate-pulse rounded-md bg-slate-200" />

        <div className="mt-3 h-4 w-64 animate-pulse rounded-md bg-slate-200" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-xl border border-slate-200 bg-white"
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="h-[390px] animate-pulse rounded-xl border border-slate-200 bg-white"
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="h-80 animate-pulse rounded-xl border border-slate-200 bg-white"
          />
        ))}
      </div>
    </div>
  );
}

function DashboardError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.3 4.7 3.2 16.8A2 2 0 0 0 4.9 20h14.2a2 2 0 0 0 1.7-3.2L13.7 4.7a2 2 0 0 0-3.4 0Z"
            />
          </svg>
        </div>

        <h2 className="mt-4 text-base font-semibold text-slate-900">
          Gagal memuat dashboard
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}

function Dashboard() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response = await getDashboard();

        setDashboard(response.data);
      } catch (error: any) {
        console.error(
          "Failed to load dashboard:",
          error
        );

        setError(
          error?.response?.data?.message ||
            "Terjadi kesalahan saat mengambil data dashboard."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error && !dashboard) {
    return (
      <DashboardError
        message={error}
        onRetry={() => loadDashboard()}
      />
    );
  }

  if (!dashboard) {
    return null;
  }

  const { summary } = dashboard;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Ringkasan inventory dan aktivitas terbaru.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadDashboard(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={[
              "h-4 w-4",
              refreshing ? "animate-spin" : "",
            ].join(" ")}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 11a8.1 8.1 0 0 0-14.8-4L3 10"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4v6h6"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 13a8.1 8.1 0 0 0 14.8 4L21 14"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 20v-6h-6"
            />
          </svg>

          {refreshing ? "Memperbarui..." : "Refresh"}
        </button>
      </div>

      {/* Error banner when refresh fails */}
      {error && (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={() => loadDashboard(true)}
            className="shrink-0 text-sm font-medium text-red-700 underline underline-offset-2"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Products"
          value={Number(summary.total_products).toLocaleString(
            "id-ID"
          )}
          description="Produk aktif dalam sistem"
          icon={<ProductsIcon />}
        />

        <StatCard
          title="Total Stock"
          value={Number(summary.total_stock).toLocaleString(
            "id-ID"
          )}
          description="Jumlah seluruh stok"
          icon={<StockIcon />}
        />

        <StatCard
          title="Low Stock"
          value={Number(summary.low_stock).toLocaleString(
            "id-ID"
          )}
          description="Produk dengan stok rendah"
          icon={<WarningIcon />}
        />

        <StatCard
          title="Warehouses"
          value={Number(
            summary.total_warehouses
          ).toLocaleString("id-ID")}
          description="Gudang aktif dalam sistem"
          icon={<WarehouseIcon />}
        />
      </section>

      {/* Charts */}
      <section className="grid gap-6 xl:grid-cols-2">
        <StockMovementChart
          stockIn={Number(
            dashboard.stock_movement.stock_in
          )}
          stockOut={Number(
            dashboard.stock_movement.stock_out
          )}
        />

        <WarehouseStockChart
          data={dashboard.stock_by_warehouse}
        />
      </section>

      {/* Tables */}
      <section className="grid gap-6 xl:grid-cols-2">
        <LowStockTable
          data={dashboard.low_stock_products}
        />

        <RecentTransactions
          data={dashboard.recent_transactions}
        />
      </section>
    </div>
  );
}

export default Dashboard;