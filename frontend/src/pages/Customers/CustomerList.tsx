import {
  useEffect,
  useState,
} from "react";

import {
  deleteCustomer,
  getCustomers,
} from "../../services/customerService";

import type {
  Customer,
  CustomerPaginationMeta,
} from "../../types/customer";

import CustomerFormModal from "../../components/customers/CustomerFormModal";

const PER_PAGE = 10;

function CustomerList() {
  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [meta, setMeta] =
    useState<CustomerPaginationMeta | null>(
      null
    );

  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [customerToDelete, setCustomerToDelete] =
    useState<Customer | null>(null);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const [searchTimeout, setSearchTimeout] =
    useState<ReturnType<typeof setTimeout> | null>(
      null
    );

  const loadCustomers = async (
    page = 1
  ) => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getCustomers({
          search:
            search.trim() || undefined,
          per_page: PER_PAGE,
          page,
        });

      setCustomers(response.data);
      setMeta(response.meta);
    } catch (error: any) {
      console.error(
        "Failed to load customers:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Gagal mengambil data customers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers(1);
  }, []);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      loadCustomers(1);
    }, 400);

    setSearchTimeout(timeout);

    return () => {
      clearTimeout(timeout);
    };
  }, [search]);

  const handleSearchChange = (
    value: string
  ) => {
    setSearchInput(value);
    setSearch(value);
  };

  const handleReset = () => {
    setSearchInput("");
    setSearch("");
  };

  const handleAdd = () => {
    setSelectedCustomer(null);
    setModalOpen(true);
  };

  const handleEdit = (
    customer: Customer
  ) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const handleDelete = (
    customer: Customer
  ) => {
    setCustomerToDelete(customer);
  };

  const confirmDelete = async () => {
    if (!customerToDelete) {
      return;
    }

    try {
      setDeletingId(
        customerToDelete.id
      );

      setError("");

      await deleteCustomer(
        customerToDelete.id
      );

      setCustomerToDelete(null);

      /*
       * Reload current page.
       * If the deletion makes the current page
       * empty, move to the previous page.
       */
      const currentPage =
        meta?.current_page ?? 1;

      const remainingOnPage =
        customers.length - 1;

      if (
        remainingOnPage <= 0 &&
        currentPage > 1
      ) {
        await loadCustomers(
          currentPage - 1
        );
      } else {
        await loadCustomers(
          currentPage
        );
      }
    } catch (error: any) {
      console.error(
        "Failed to delete customer:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Gagal menghapus customer."
      );
    } finally {
      setDeletingId(null);
    }
  };


  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Customers
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Kelola customer yang menggunakan produk inventory.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          <span className="text-lg leading-none">
            +
          </span>

          Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="w-full sm:max-w-md">
            <label
              htmlFor="customer-search"
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
                id="customer-search"
                type="text"
                value={searchInput}
                onChange={(event) =>
                  handleSearchChange(
                    event.target.value
                  )
                }
                placeholder="Search code, business name, contact..."
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
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
        {customers.length === 0 ? (
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
                No customers found
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Coba ubah pencarian atau tambahkan customer baru.
              </p>

              {search && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-4 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Code
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Business
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Contact
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Email
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Phone
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map(
                    (customer) => (
                      <tr
                        key={customer.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                      >
                        <td className="px-5 py-4">
                          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                            {customer.code}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-slate-800">
                            {
                              customer.business_name
                            }
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {
                            customer.contact_person ||
                            "-"
                          }
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {customer.email ||
                            "-"}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {customer.phone ||
                            "-"}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(
                                  customer
                                )
                              }
                              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  customer
                                )
                              }
                              disabled={
                                deletingId ===
                                customer.id
                              }
                              className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingId ===
                              customer.id
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

            {/* Pagination */}
            {meta && (
              <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-medium text-slate-700">
                    {meta.from ?? 0}
                  </span>{" "}
                  –{" "}
                  <span className="font-medium text-slate-700">
                    {meta.to ?? 0}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-slate-700">
                    {meta.total}
                  </span>{" "}
                  customers
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={
                      meta.current_page === 1 ||
                      loading
                    }
                    onClick={() =>
                      loadCustomers(
                        meta.current_page - 1
                      )
                    }
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <span className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white">
                    {meta.current_page}
                  </span>

                  <button
                    type="button"
                    disabled={
                      meta.current_page >=
                        meta.last_page ||
                      loading
                    }
                    onClick={() =>
                      loadCustomers(
                        meta.current_page + 1
                      )
                    }
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation */}
      {customerToDelete && (
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
                Delete Customer?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Apakah kamu yakin ingin menghapus{" "}
                <span className="font-semibold text-slate-700">
                  "{customerToDelete.business_name}"
                </span>
                ?
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setCustomerToDelete(
                    null
                  )
                }
                disabled={
                  deletingId !== null
                }
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={
                  deletingId !== null
                }
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deletingId !== null
                  ? "Deleting..."
                  : "Delete Customer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <CustomerFormModal
        open={modalOpen}
        customer={selectedCustomer}
        onClose={() => {
          setModalOpen(false);
          setSelectedCustomer(null);
        }}
        onSuccess={() =>
          loadCustomers(1)
        }
      />
    </div>
  );
}

export default CustomerList;