import { useEffect, useState } from "react";

import {
  getInventoryReport,
  getStockByWarehouseReport,
  getStockMovementReport,
  getTransactionReport,
} from "../../services/reportService";

import type {
  InventoryReportItem,
  StockByWarehouseItem,
  StockMovementReport,
  TransactionReportItem,
} from "../../types/report";

import { getWarehouses } from "../../services/warehouseService";
import { getProducts } from "../../services/productService";
import { getCustomers } from "../../services/customerService";

import type { Warehouse } from "../../types/warehouse";
import type { Product } from "../../types/product";
import type { Customer } from "../../types/customer";

const ReportPage = () => {
  const [inventory, setInventory] = useState<InventoryReportItem[]>([]);
  const [transactions, setTransactions] = useState<
    TransactionReportItem[]
  >([]);
  const [stockMovement, setStockMovement] =
    useState<StockMovementReport | null>(null);
  const [stockByWarehouse, setStockByWarehouse] = useState<
    StockByWarehouseItem[]
  >([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [inventoryWarehouseId, setInventoryWarehouseId] =
  useState<number | undefined>();

  const [inventoryProductId, setInventoryProductId] =
    useState<number | undefined>();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [transactionType, setTransactionType] = useState<
    "in" | "out" | "adjustment" | ""
  >("");

  const [transactionWarehouseId, setTransactionWarehouseId] =
    useState<number | undefined>();

  const [transactionCustomerId, setTransactionCustomerId] =
    useState<number | undefined>();

  const [referenceType, setReferenceType] = useState("");

  const fetchMasterData = async () => {
    try {
      const [warehouseResponse, productResponse, customerResponse] =
        await Promise.all([
          getWarehouses(),
          getProducts(),
          getCustomers({
            per_page: 100,
            page: 1,
          }),
        ]);

      setWarehouses(warehouseResponse);
      setProducts(productResponse.data);
      setCustomers(customerResponse.data);
    } catch (error) {
      console.error("Failed to fetch master data:", error);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        inventoryResponse,
        transactionResponse,
        movementResponse,
        warehouseResponse,
      ] = await Promise.all([
        getInventoryReport({
          warehouse_id: inventoryWarehouseId,
          product_id: inventoryProductId,
        }),

        getTransactionReport({
          start_date: startDate || undefined,
          end_date: endDate || undefined,
          type: transactionType || undefined,
          warehouse_id: transactionWarehouseId,
          customer_id: transactionCustomerId,
          reference_type: referenceType || undefined,
        }),

        getStockMovementReport({
          start_date: startDate || undefined,
          end_date: endDate || undefined,
          warehouse_id: transactionWarehouseId,
        }),

        getStockByWarehouseReport(),
      ]);

      setInventory(inventoryResponse.data);
      setTransactions(transactionResponse.data);
      setStockMovement(movementResponse.data);
      setStockByWarehouse(warehouseResponse.data);
    } catch (error: any) {
      console.error("Failed to fetch reports:", error);

      setError(
        error?.response?.data?.message ||
          "Gagal mengambil data laporan."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchMasterData();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStockStatus = (status: string) => {
    switch (status) {
      case "safe":
        return {
          label: "Safe",
          className: "bg-green-50 text-green-700",
        };

      case "low_stock":
        return {
          label: "Low Stock",
          className: "bg-yellow-50 text-yellow-700",
        };

      case "out_of_stock":
        return {
          label: "Out of Stock",
          className: "bg-red-50 text-red-700",
        };

      default:
        return {
          label: status,
          className: "bg-gray-50 text-gray-700",
        };
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-7 w-32 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-72 rounded bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>

        <div className="h-72 animate-pulse rounded-xl bg-gray-100" />

        <div className="h-96 animate-pulse rounded-xl bg-gray-100" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Reports
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor inventory and transaction activity.
          </p>
        </div>

        <div className="rounded-xl border border-red-100 bg-red-50 p-6">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchReports}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Reports
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Monitor inventory and transaction activity.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchReports}
          className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h5M20 20v-5h-5M5.05 9A7 7 0 0117.9 6.1L20 9M19 15a7 7 0 01-12.85 2.9L4 15"
            />
          </svg>

          Refresh
        </button>
      </div>
      {/* Inventory Filter */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-gray-900">
            Inventory Filter
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Filter inventory by warehouse and product.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Warehouse
            </label>

            <select
              value={inventoryWarehouseId ?? ""}
              onChange={(event) =>
                setInventoryWarehouseId(
                  event.target.value
                    ? Number(event.target.value)
                    : undefined
                )
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-gray-400"
            >
              <option value="">All Warehouses</option>

              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.code} - {warehouse.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Product
            </label>

            <select
              value={inventoryProductId ?? ""}
              onChange={(event) =>
                setInventoryProductId(
                  event.target.value
                    ? Number(event.target.value)
                    : undefined
                )
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-gray-400"
            >
              <option value="">All Products</option>

              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.sku} - {product.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={fetchReports}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Apply Filter
          </button>
        </div>
      </div>

      {/* Transaction Filter */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-gray-900">
            Transaction Filter
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Filter transaction reports by period and transaction details.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Start Date */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              End Date
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400"
            />
          </div>

          {/* Type */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Type
            </label>

            <select
              value={transactionType}
              onChange={(event) =>
                setTransactionType(
                  event.target.value as
                    | "in"
                    | "out"
                    | "adjustment"
                    | ""
                )
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-400"
            >
              <option value="">All Types</option>
              <option value="in">Stock In</option>
              <option value="out">Stock Out</option>
              <option value="adjustment">Adjustment</option>
            </select>
          </div>

          {/* Warehouse */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Warehouse
            </label>

            <select
              value={transactionWarehouseId ?? ""}
              onChange={(event) =>
                setTransactionWarehouseId(
                  event.target.value
                    ? Number(event.target.value)
                    : undefined
                )
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-400"
            >
              <option value="">All Warehouses</option>

              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.code} - {warehouse.name}
                </option>
              ))}
            </select>
          </div>

          {/* Customer */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Customer
            </label>

            <select
              value={transactionCustomerId ?? ""}
              onChange={(event) =>
                setTransactionCustomerId(
                  event.target.value
                    ? Number(event.target.value)
                    : undefined
                )
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-400"
            >
              <option value="">All Customers</option>

              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.code} - {customer.business_name}
                </option>
              ))}
            </select>
          </div>

          {/* Reference Type */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Reference Type
            </label>

            <select
              value={referenceType}
              onChange={(event) =>
                setReferenceType(event.target.value)
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-400"
            >
              <option value="">All References</option>
              <option value="purchase">Purchase</option>
              <option value="sales">Sales</option>
              <option value="adjustment">Adjustment</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={fetchReports}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Apply Filter
          </button>
        </div>
      </div>        


      {/* Stock Movement Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Stock In</p>

          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {stockMovement?.stock_in ?? 0}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Total stock in transactions
          </p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Stock Out</p>

          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {stockMovement?.stock_out ?? 0}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Total stock out transactions
          </p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Adjustment</p>

          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {stockMovement?.adjustment ?? 0}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Total adjustment transactions
          </p>
        </div>
      </div>

      {/* Stock by Warehouse */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="text-base font-semibold text-gray-900">
            Stock by Warehouse
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Current total stock for each warehouse.
          </p>
        </div>

        <div className="p-6">
          {stockByWarehouse.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-gray-500">
                No warehouse stock data available.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {stockByWarehouse.map((warehouse) => (
                <div
                  key={warehouse.warehouse_id}
                  className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {warehouse.warehouse_name}
                    </p>

                    <p className="text-xs text-gray-500">
                      Warehouse ID: {warehouse.warehouse_id}
                    </p>
                  </div>

                  <p className="text-lg font-semibold text-gray-900">
                    {warehouse.total_stock.toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Inventory Report */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="text-base font-semibold text-gray-900">
            Inventory Report
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Current inventory by product and warehouse.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Product
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  SKU
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Warehouse
                </th>

                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
                  Stock
                </th>

                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
                  Minimum
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {inventory.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No inventory data available.
                  </td>
                </tr>
              ) : (
                inventory.map((item) => {
                  const status = getStockStatus(
                    item.stock_status
                  );

                  return (
                    <tr
                      key={`${item.product_id}-${item.warehouse_id}`}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.product_name}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-500">
                            ID: {item.product_id}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.sku}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.warehouse_name}
                      </td>

                      <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        {item.quantity.toLocaleString("id-ID")}
                      </td>

                      <td className="px-6 py-4 text-right text-sm text-gray-600">
                        {item.minimum_stock.toLocaleString("id-ID")}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Report */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="text-base font-semibold text-gray-900">
            Transaction Report
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Inventory transaction history.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Transaction
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Type
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Warehouse
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Customer
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Reference
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No transaction data available.
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.transaction_number}
                      </p>

                      {transaction.notes && (
                        <p className="mt-0.5 max-w-xs truncate text-xs text-gray-500">
                          {transaction.notes}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm font-medium capitalize text-gray-700">
                        {transaction.type === "in"
                          ? "Stock In"
                          : transaction.type === "out"
                          ? "Stock Out"
                          : "Adjustment"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {transaction.warehouse || "-"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {transaction.customer || "-"}
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">
                        {transaction.reference_type || "-"}
                      </p>

                      {transaction.reference_number && (
                        <p className="mt-0.5 text-xs text-gray-500">
                          {transaction.reference_number}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(transaction.transaction_date)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;