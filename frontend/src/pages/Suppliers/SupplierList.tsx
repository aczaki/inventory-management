import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  deleteSupplier,
  getSuppliers,
} from "../../services/supplierService";

import type { Supplier } from "../../types/supplier";

import SupplierFormModal from "../../components/suppliers/SupplierFormModal";

function SupplierList() {
  const [suppliers, setSuppliers] =
    useState<Supplier[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [selectedSupplier, setSelectedSupplier] =
    useState<Supplier | null>(null);

  const [supplierToDelete, setSupplierToDelete] =
    useState<Supplier | null>(null);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getSuppliers();

      setSuppliers(response.data);
    } catch (error: any) {
      console.error(
        "Failed to load suppliers:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Gagal mengambil data suppliers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const filteredSuppliers =
    useMemo(() => {
      const keyword =
        search.trim().toLowerCase();

      if (!keyword) {
        return suppliers;
      }

      return suppliers.filter(
        (supplier) =>
          supplier.code
            .toLowerCase()
            .includes(keyword) ||
          supplier.name
            .toLowerCase()
            .includes(keyword) ||
          (
            supplier.contact_person ?? ""
          )
            .toLowerCase()
            .includes(keyword) ||
          (
            supplier.email ?? ""
          )
            .toLowerCase()
            .includes(keyword) ||
          (
            supplier.phone ?? ""
          )
            .toLowerCase()
            .includes(keyword)
      );
    }, [suppliers, search]);

  const handleAdd = () => {
    setSelectedSupplier(null);
    setModalOpen(true);
  };

  const handleEdit = (
    supplier: Supplier
  ) => {
    setSelectedSupplier(supplier);
    setModalOpen(true);
  };

  const handleDelete = (
    supplier: Supplier
  ) => {
    setSupplierToDelete(supplier);
  };

  const confirmDelete = async () => {
    if (!supplierToDelete) {
      return;
    }

    try {
      setDeletingId(
        supplierToDelete.id
      );

      setError("");

      await deleteSupplier(
        supplierToDelete.id
      );

      setSupplierToDelete(null);

      await loadSuppliers();
    } catch (error: any) {
      console.error(
        "Failed to delete supplier:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Gagal menghapus supplier."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-end justify-between">
          <div>
            <div className="h-8 w-32 animate-pulse rounded-md bg-slate-200" />

            <div className="mt-2 h-4 w-64 animate-pulse rounded-md bg-slate-200" />
          </div>

          <div className="h-10 w-36 animate-pulse rounded-lg bg-slate-200" />
        </div>

        <div className="mt-6 h-20 animate-pulse rounded-xl border border-slate-200 bg-white" />

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-12 animate-pulse rounded-lg bg-slate-100"
                />
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Suppliers
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Kelola supplier yang digunakan dalam inventory.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <span className="text-lg leading-none">
            +
          </span>

          Add Supplier
        </button>
      </div>

      {/* Search */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="w-full sm:max-w-md">
            <label
              htmlFor="supplier-search"
              className="mb-2 block text-xs font-medium text-slate-500"
            >
              Search
            </label>

            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m20 20-4-4"
                />
              </svg>

              <input
                id="supplier-search"
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search supplier..."
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSearch("")}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {filteredSuppliers.length === 0 ? (
          <div className="flex min-h-72 items-center justify-center px-6 py-12">
            <div className="text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-slate-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle
                    cx="12"
                    cy="8"
                    r="4"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 21a8 8 0 0 1 16 0"
                  />
                </svg>
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-800">
                No suppliers found
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Coba ubah kata pencarian atau tambahkan supplier baru.
              </p>

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="mt-4 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Code
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Supplier
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Contact
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Phone
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredSuppliers.map(
                  (supplier) => (
                    <tr
                      key={supplier.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                    >
                      {/* Code */}
                      <td className="px-5 py-4">
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                          {supplier.code}
                        </span>
                      </td>

                      {/* Supplier */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-800">
                          {supplier.name}
                        </p>

                        {supplier.email && (
                          <p className="mt-1 text-xs text-slate-400">
                            {supplier.email}
                          </p>
                        )}
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {supplier.contact_person ||
                          "-"}
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {supplier.phone || "-"}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={[
                            "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                            supplier.status ===
                              "active"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-600",
                          ].join(" ")}
                        >
                          {supplier.status ===
                          "active"
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                supplier
                              )
                            }
                            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                supplier
                              )
                            }
                            disabled={
                              deletingId ===
                              supplier.id
                            }
                            className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId ===
                            supplier.id
                              ? "..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {supplierToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 p-4">
          <div
            className="w-full max-w-md rounded-2xl bg-white shadow-xl"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex justify-center pt-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-500"
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
              </div>
            </div>

            <div className="px-6 pb-6 pt-5 text-center">
              <h2 className="text-lg font-semibold text-slate-900">
                Delete Supplier?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Apakah kamu yakin ingin menghapus{" "}
                <span className="font-semibold text-slate-700">
                  "{supplierToDelete.name}"
                </span>
                ?
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setSupplierToDelete(null)
                }
                disabled={
                  deletingId !== null
                }
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={
                  deletingId !== null
                }
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId !== null
                  ? "Deleting..."
                  : "Delete Supplier"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <SupplierFormModal
        open={modalOpen}
        supplier={selectedSupplier}
        onClose={() => {
          setModalOpen(false);
          setSelectedSupplier(null);
        }}
        onSuccess={loadSuppliers}
      />
    </div>
  );
}

export default SupplierList;