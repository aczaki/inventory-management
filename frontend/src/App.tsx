import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./layouts/DashboardLayout";

import {
  clearAuth,
  getMe,
  getToken,
} from "./services/authService";

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [checkingAuth, setCheckingAuth] =
    useState(true);

  const [authenticated, setAuthenticated] =
    useState(false);

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
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
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