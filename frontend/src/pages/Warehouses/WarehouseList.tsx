import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  ChevronDown,
  Edit,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";

import {
  deleteWarehouse,
  getWarehouses,
} from "../../services/warehouseService";

import type { Warehouse } from "../../types/warehouse";
import WarehouseFormModal from "../../components/warehouses/WarehouseFormModal";
import WarehouseDetailModal from "../../components/warehouses/WarehouseDetailModal";

const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [deleteTarget, setDeleteTarget] = useState<Warehouse | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] =
    useState<Warehouse | null>(null);
  
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] =
  useState<Warehouse | null>(null);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getWarehouses();

      setWarehouses(data);
    } catch (err: any) {
      console.error("Failed to fetch warehouses:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load warehouse data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const filteredWarehouses = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return warehouses.filter((warehouse) => {
      const matchesSearch =
        keyword === "" ||
        warehouse.code.toLowerCase().includes(keyword) ||
        warehouse.name.toLowerCase().includes(keyword) ||
        warehouse.address?.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "all" ||
        warehouse.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [warehouses, search, statusFilter]);

  const handleFormSuccess = (warehouse: Warehouse) => {
  setWarehouses((current) => {
    const exists = current.some(
      (item) => item.id === warehouse.id
    );

    if (exists) {
      return current.map((item) =>
        item.id === warehouse.id ? warehouse : item
      );
    }

    return [warehouse, ...current];
  });

  setFormModalOpen(false);
  setEditingWarehouse(null);
};

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);

      await deleteWarehouse(deleteTarget.id);

      setWarehouses((current) =>
        current.filter((warehouse) => warehouse.id !== deleteTarget.id)
      );

      setDeleteTarget(null);
    } catch (err: any) {
      console.error("Failed to delete warehouse:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to delete warehouse. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  const activeCount = warehouses.filter(
    (warehouse) => warehouse.status === "active"
  ).length;

  const inactiveCount = warehouses.filter(
    (warehouse) => warehouse.status === "inactive"
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-gray-700" />

            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Warehouses
            </h1>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Manage your warehouse locations and status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingWarehouse(null);
            setFormModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          Add Warehouse
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Total Warehouses
          </p>

          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {warehouses.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Active
          </p>

          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {activeCount}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Inactive
          </p>

          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {inactiveCount}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-red-700">{error}</p>

          <button
            type="button"
            onClick={fetchWarehouses}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}

      {/* Main Card */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search warehouse..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value as
                        | "all"
                        | "active"
                        | "inactive"
                    )
                  }
                  className="appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-3 pr-9 text-sm font-medium text-gray-700 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>

              {/* Refresh */}
              <button
                type="button"
                onClick={fetchWarehouses}
                disabled={loading}
                title="Refresh"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="divide-y divide-gray-100">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-gray-200" />

                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 rounded bg-gray-200" />
                    <div className="h-3 w-48 rounded bg-gray-200" />
                  </div>

                  <div className="hidden h-4 w-16 rounded bg-gray-200 sm:block" />
                  <div className="hidden h-4 w-20 rounded bg-gray-200 sm:block" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredWarehouses.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <Building2 className="h-6 w-6 text-gray-400" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-gray-900">
              No warehouses found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-gray-500">
              {search || statusFilter !== "all"
                ? "Try changing your search or filter."
                : "There are no warehouses available yet."}
            </p>
          </div>
        ) : (
          /* Table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/70">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Warehouse
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Code
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Address
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredWarehouses.map((warehouse) => (
                  <tr
                    key={warehouse.id}
                    className="transition hover:bg-gray-50/70"
                  >
                    {/* Warehouse */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                          <Building2 className="h-5 w-5 text-gray-600" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {warehouse.name}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-500">
                            ID #{warehouse.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Code */}
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-gray-100 px-2 py-1 font-mono text-xs font-medium text-gray-700">
                        {warehouse.code}
                      </span>
                    </td>

                    {/* Address */}
                    <td className="max-w-xs px-5 py-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

                        <p className="line-clamp-2 text-sm text-gray-600">
                          {warehouse.address || "No address"}
                        </p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          warehouse.status === "active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            warehouse.status === "active"
                              ? "bg-emerald-500"
                              : "bg-gray-400"
                          }`}
                        />

                        {warehouse.status === "active"
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingWarehouse(warehouse);
                            setFormModalOpen(true);
                          }}
                          title="Edit warehouse"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedWarehouse(warehouse);
                            setDetailModalOpen(true);
                          }}
                          title="View warehouse"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                        >
                          <Building2 className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(warehouse)}
                          title="Delete warehouse"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {!loading && filteredWarehouses.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-3">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-700">
                {filteredWarehouses.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-700">
                {warehouses.length}
              </span>{" "}
              warehouses
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              Delete warehouse?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-800">
                {deleteTarget.name}
              </span>
              ? This action will remove the warehouse from the current
              warehouse list.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting && (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                )}

                {deleting ? "Deleting..." : "Delete Warehouse"}
              </button>
            </div>
          </div>
        </div>
      )}
      <WarehouseFormModal
        isOpen={formModalOpen}
        warehouse={editingWarehouse}
        onClose={() => {
          if (deleting) return;

          setFormModalOpen(false);
          setEditingWarehouse(null);
        }}
        onSuccess={handleFormSuccess}
      />
      
      <WarehouseDetailModal
        isOpen={detailModalOpen}
        warehouse={selectedWarehouse}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedWarehouse(null);
        }}
      />
    </div>
  );
};

export default WarehouseList;