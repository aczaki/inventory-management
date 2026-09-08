import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";

import {
  clearAuth,
  getMe,
  getToken,
} from "./services/authService";

import { getDashboard } from "./services/dashboardService";
import type { DashboardData } from "./types/dashboard";

import StatCard from "./components/dashboard/StatCard";
import StockMovementChart from "./components/dashboard/StockMovementChart";
import WarehouseStockChart from "./components/dashboard/WarehouseStockChart";
import LowStockTable from "./components/dashboard/LowStockTable";
import RecentTransactions from "./components/dashboard/RecentTransactions";

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAuthentication = async () => {
      const token = getToken();

      if (!token) {
        setAuthenticated(false);
        setCheckingAuth(false);
        return;
      }

      try {
        await getMe();
        setAuthenticated(true);
      } catch (error) {
        console.error(
          "Authentication verification failed:",
          error
        );

        clearAuth();
        setAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    verifyAuthentication();
  }, []);

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-sm text-slate-500">
          Memverifikasi sesi...
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

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

function Dashboard() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
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
            "Gagal mengambil data dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Ringkasan inventory saat ini.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Ringkasan inventory saat ini.
        </p>

        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  const { summary } = dashboard;

  return (
    <div>
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Ringkasan inventory saat ini.
        </p>
      </div>

      {/* Summary Cards */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Products"
          value={summary.total_products}
          description="Produk aktif dalam sistem"
          icon={<ProductsIcon />}
        />

        <StatCard
          title="Total Stock"
          value={summary.total_stock}
          description="Jumlah seluruh stok"
          icon={<StockIcon />}
        />

        <StatCard
          title="Low Stock"
          value={summary.low_stock}
          description="Produk dengan stok rendah"
          icon={<WarningIcon />}
        />

        <StatCard
          title="Warehouses"
          value={summary.total_warehouses}
          description="Gudang aktif dalam sistem"
          icon={<WarehouseIcon />}
        />
      </section>

      {/* Stock Movement Chart */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <StockMovementChart
            stockIn={dashboard.stock_movement.stock_in}
            stockOut={dashboard.stock_movement.stock_out}
          />
  
      {/* Warehouse Stock Chart */}

          <WarehouseStockChart
            data={dashboard.stock_by_warehouse}
          />
        </div>

      {/* Low Stock Products & Recent Transactions */}
        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <LowStockTable
            data={dashboard.low_stock_products}
          />

          <RecentTransactions
            data={dashboard.recent_transactions}
          />
        </div>
    </div>
  );
}

function PlaceholderPage({
  title,
}: {
  title: string;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        {title}
      </h1>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8">
        <p className="text-sm text-slate-500">
          Halaman ini akan dikembangkan pada sprint berikutnya.
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PlaceholderPage title="Products" />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PlaceholderPage title="Categories" />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/suppliers"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PlaceholderPage title="Suppliers" />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PlaceholderPage title="Customers" />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/warehouses"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PlaceholderPage title="Warehouses" />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/inventory/stock"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PlaceholderPage title="Stock" />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/inventory/stock-in"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PlaceholderPage title="Stock In" />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/inventory/stock-out"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PlaceholderPage title="Stock Out" />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/inventory/adjustment"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PlaceholderPage title="Adjustment" />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/inventory/transactions"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PlaceholderPage title="Transactions" />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PlaceholderPage title="Reports" />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;