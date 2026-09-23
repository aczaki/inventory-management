import { useEffect, useState } from "react";

import { getWarehouses } from "../../services/warehouseService";
import { getCustomers } from "../../services/customerService";
import { getInventoryTransaction, getInventoryTransactions } from "../../services/inventoryTransactionService";
import TransactionDetailModal from "../../components/inventory/TransactionDetailModal";

import type { Warehouse } from "../../types/warehouse";
import type { Customer } from "../../types/customer";
import type {
  InventoryTransaction,
  InventoryTransactionQueryParams,
} from "../../types/inventoryTransaction";

const PER_PAGE = 10;

const TransactionList = () => {
  const [transactions, setTransactions] = useState<
    InventoryTransaction[]
  >([]);

  const [warehouses, setWarehouses] = useState<Warehouse[]>(
    []
  );

  const [customers, setCustomers] = useState<Customer[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [error, setError] = useState("");

  const [type, setType] = useState<
    "" | "in" | "out" | "adjustment"
  >("");

  const [warehouseId, setWarehouseId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [referenceType, setReferenceType] = useState("");

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [selectedTransaction, setSelectedTransaction] =
    useState<InventoryTransaction | null>(null);
  
  const [detailLoading, setDetailLoading] = useState(false);

  const [detailError, setDetailError] = useState<string | null>(null);

  const handleViewTransaction = async (id: number) => {
    try {
        setDetailLoading(true);
        setDetailError(null);
        setSelectedTransaction(null);

        const data = await getInventoryTransaction(id);

        setSelectedTransaction(data);
    } catch (error: any) {
        console.error("Failed to fetch transaction detail:", error);

        setDetailError(
        error?.response?.data?.message ||
            "Gagal mengambil detail transaksi."
        );
    } finally {
        setDetailLoading(false);
    }
  };
  
  const fetchTransactions = async (
    currentPage = page
  ) => {
    try {
      setLoading(true);
      setError("");

      const params: InventoryTransactionQueryParams = {
        per_page: PER_PAGE,
        page: currentPage,
      };

      if (type) {
        params.type = type;
      }

      if (warehouseId) {
        params.warehouse_id = Number(warehouseId);
      }

      if (customerId) {
        params.customer_id = Number(customerId);
      }

      if (referenceType) {
        params.reference_type = referenceType;
      }

      const response =
        await getInventoryTransactions(params);

      setTransactions(response.data);
      setPage(response.meta.current_page);
      setLastPage(response.meta.last_page);
      setTotal(response.meta.total);
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Gagal memuat transaction history."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterData = async () => {
    try {
      setLoadingFilters(true);

      const [warehouseResponse, customerResponse] =
        await Promise.all([
          getWarehouses(),
          getCustomers({
            per_page: 100,
            page: 1,
          }),
        ]);

      setWarehouses(warehouseResponse);
      setCustomers(customerResponse.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFilters(false);
    }
  };

  useEffect(() => {
    fetchFilterData();
  }, []);

  useEffect(() => {
    fetchTransactions(1);
  }, [
    type,
    warehouseId,
    customerId,
    referenceType,
  ]);

  const handleReset = () => {
    setType("");
    setWarehouseId("");
    setCustomerId("");
    setReferenceType("");
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > lastPage) {
      return;
    }

    fetchTransactions(newPage);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeLabel = (transactionType: string) => {
    switch (transactionType) {
      case "in":
        return "Stock In";

      case "out":
        return "Stock Out";

      case "adjustment":
        return "Adjustment";

      default:
        return transactionType;
    }
  };

  const getTypeClassName = (transactionType: string) => {
    switch (transactionType) {
      case "in":
        return "bg-green-50 text-green-700";

      case "out":
        return "bg-red-50 text-red-700";

      case "adjustment":
        return "bg-blue-50 text-blue-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getReferenceTypeLabel = (
    referenceType: string | null
  ) => {
    if (!referenceType) {
      return "-";
    }

    switch (referenceType) {
      case "purchase":
        return "Purchase";

      case "sales":
        return "Sales";

      case "adjustment":
        return "Adjustment";

      default:
        return referenceType;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Transaction History
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Riwayat seluruh aktivitas inventory.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchTransactions(page)}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg
            className={`h-4 w-4 ${
              loading ? "animate-spin" : ""
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h5M20 20v-5h-5"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 9a8.1 8.1 0 00-14.9-4M4 15a8.1 8.1 0 0014.9 4"
            />
          </svg>

          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Filters
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {/* Type */}
          <div>
            <label
              htmlFor="transaction-type"
              className="mb-2 block text-xs font-medium text-slate-600"
            >
              Transaction Type
            </label>

            <select
              id="transaction-type"
              value={type}
              onChange={(event) =>
                setType(
                  event.target.value as
                    | ""
                    | "in"
                    | "out"
                    | "adjustment"
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            >
              <option value="">All Types</option>
              <option value="in">Stock In</option>
              <option value="out">Stock Out</option>
              <option value="adjustment">Adjustment</option>
            </select>
          </div>

          {/* Warehouse */}
          <div>
            <label
              htmlFor="transaction-warehouse"
              className="mb-2 block text-xs font-medium text-slate-600"
            >
              Warehouse
            </label>

            <select
              id="transaction-warehouse"
              value={warehouseId}
              onChange={(event) =>
                setWarehouseId(event.target.value)
              }
              disabled={loadingFilters}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            >
              <option value="">All Warehouses</option>

              {warehouses.map((warehouse) => (
                <option
                  key={warehouse.id}
                  value={warehouse.id}
                >
                  {warehouse.code} - {warehouse.name}
                </option>
              ))}
            </select>
          </div>

          {/* Customer */}
          <div>
            <label
              htmlFor="transaction-customer"
              className="mb-2 block text-xs font-medium text-slate-600"
            >
              Customer
            </label>

            <select
              id="transaction-customer"
              value={customerId}
              onChange={(event) =>
                setCustomerId(event.target.value)
              }
              disabled={loadingFilters}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            >
              <option value="">All Customers</option>

              {customers.map((customer) => (
                <option
                  key={customer.id}
                  value={customer.id}
                >
                  {customer.code} - {customer.business_name}
                </option>
              ))}
            </select>
          </div>

          {/* Reference Type */}
          <div>
            <label
              htmlFor="reference-type"
              className="mb-2 block text-xs font-medium text-slate-600"
            >
              Reference Type
            </label>

            <select
              id="reference-type"
              value={referenceType}
              onChange={(event) =>
                setReferenceType(event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            >
              <option value="">All References</option>
              <option value="purchase">Purchase</option>
              <option value="sales">Sales</option>
              <option value="adjustment">
                Adjustment
              </option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <svg
            className="mt-0.5 h-5 w-5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="9" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01"
            />
          </svg>

          <span>{error}</span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Transaction
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Type
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Warehouse
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Reference
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  User
                </th>
                <th className="px-6 py-4 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 6 }).map(
                  (_, index) => (
                    <tr key={index}>
                      {Array.from({ length: 7 }).map(
                        (_, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-5 py-4"
                          >
                            <div className="h-4 animate-pulse rounded bg-slate-100" />
                          </td>
                        )
                      )}
                    </tr>
                  )
                )
              ) : transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-16 text-center"
                  >
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <svg
                          className="h-6 w-6 text-slate-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5h6M9 9h6M9 13h4"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"
                          />
                        </svg>
                      </div>

                      <h3 className="mt-4 text-sm font-semibold text-slate-900">
                        No transactions found
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Tidak ada transaksi yang sesuai
                        dengan filter saat ini.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="transition hover:bg-slate-50/60"
                  >
                    {/* Transaction */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-slate-900">
                          {transaction.transaction_number}
                        </p>

                        {transaction.notes && (
                          <p className="mt-1 max-w-xs truncate text-xs text-slate-400">
                            {transaction.notes}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getTypeClassName(
                          transaction.type
                        )}`}
                      >
                        {getTypeLabel(transaction.type)}
                      </span>
                    </td>

                    {/* Warehouse */}
                    <td className="px-5 py-4">
                      {transaction.warehouse ? (
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {transaction.warehouse.name}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {transaction.warehouse.code}
                          </p>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">
                          -
                        </span>
                      )}
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-700">
                        {transaction.customer?.name || "-"}
                      </span>
                    </td>

                    {/* Reference */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {getReferenceTypeLabel(
                            transaction.reference_type
                          )}
                        </p>

                        {transaction.reference_number && (
                          <p className="mt-0.5 text-xs text-slate-400">
                            {transaction.reference_number}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4">
                      <span className="whitespace-nowrap text-sm text-slate-600">
                        {formatDate(
                          transaction.transaction_date
                        )}
                      </span>
                    </td>

                    {/* User */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-700">
                        {transaction.user?.name || "-"}
                      </span>
                    </td>
                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                    <button
                        type="button"
                        onClick={() =>
                        handleViewTransaction(transaction.id)
                        }
                        className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        View
                    </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && transactions.length > 0 && (
          <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Menampilkan{" "}
              <span className="font-medium text-slate-700">
                {((page - 1) * PER_PAGE) + 1}
              </span>{" "}
              -{" "}
              <span className="font-medium text-slate-700">
                {Math.min(page * PER_PAGE, total)}
              </span>{" "}
              dari{" "}
              <span className="font-medium text-slate-700">
                {total}
              </span>{" "}
              transaksi
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  handlePageChange(page - 1)
                }
                disabled={page === 1 || loading}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from(
                { length: lastPage },
                (_, index) => index + 1
              )
                .filter((pageNumber) => {
                  if (lastPage <= 5) {
                    return true;
                  }

                  if (pageNumber === 1) {
                    return true;
                  }

                  if (pageNumber === lastPage) {
                    return true;
                  }

                  return Math.abs(pageNumber - page) <= 1;
                })
                .map((pageNumber, index, visiblePages) => {
                  const previousPage =
                    visiblePages[index - 1];

                  const showEllipsis =
                    previousPage &&
                    pageNumber - previousPage > 1;

                  return (
                    <div
                      key={pageNumber}
                      className="flex items-center gap-1"
                    >
                      {showEllipsis && (
                        <span className="px-1 text-slate-400">
                          ...
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          handlePageChange(pageNumber)
                        }
                        className={`min-w-9 rounded-lg px-3 py-2 text-sm font-medium transition ${
                          pageNumber === page
                            ? "bg-slate-900 text-white"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    </div>
                  );
                })}

              <button
                type="button"
                onClick={() =>
                  handlePageChange(page + 1)
                }
                disabled={
                  page === lastPage || loading
                }
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
        <TransactionDetailModal
            transaction={selectedTransaction}
            loading={detailLoading}
            error={detailError}
            onClose={() => {
                setSelectedTransaction(null);
                setDetailError(null);
            }}
        />
    </div>
    
  );
};

export default TransactionList;