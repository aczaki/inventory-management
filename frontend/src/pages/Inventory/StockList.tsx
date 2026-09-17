import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInventoryStocks } from "../../services/inventoryStockService";
import { getWarehouses } from "../../services/warehouseService";
import type { InventoryStock } from "../../types/inventoryStock";
import type { Warehouse } from "../../types/warehouse";
import StockStatus from "../../components/inventory/StockStatus";

const StockList = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState<InventoryStock[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  const [search, setSearch] = useState("");
  const [warehouseId, setWarehouseId] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingWarehouses, setLoadingWarehouses] = useState(true);
  const [error, setError] = useState("");

  const fetchStocks = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getInventoryStocks({
        ...(search.trim() && {
          search: search.trim(),
        }),
        ...(warehouseId && {
          warehouse_id: Number(warehouseId),
        }),
      });

      setStocks(data);
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data stock.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      setLoadingWarehouses(true);

      const data = await getWarehouses();

      setWarehouses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingWarehouses(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchStocks();
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, warehouseId]);

  const formatNumber = (value: number | string) => {
    return Number(value).toLocaleString("id-ID");
  };

  const handleResetFilter = () => {
    setSearch("");
    setWarehouseId("");
  };

  const hasFilter = search.trim() !== "" || warehouseId !== "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Inventory Stock
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Monitor ketersediaan stock produk di setiap warehouse.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/inventory/stock-in")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>

            Stock In
          </button>

          <button
            type="button"
            onClick={fetchStocks}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_220px_auto]">
          {/* Search */}
          <div>
            <label
              htmlFor="stock-search"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Search Product
            </label>

            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                />
              </svg>

              <input
                id="stock-search"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by SKU or product name..."
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
              />
            </div>
          </div>

          {/* Warehouse */}
          <div>
            <label
              htmlFor="warehouse-filter"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Warehouse
            </label>

            <select
              id="warehouse-filter"
              value={warehouseId}
              onChange={(event) => setWarehouseId(event.target.value)}
              disabled={loadingWarehouses}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:cursor-not-allowed disabled:bg-gray-50"
            >
              <option value="">All Warehouses</option>

              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.code} - {warehouse.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reset */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleResetFilter}
              disabled={!hasFilter}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 md:w-auto"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Product
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  SKU
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Warehouse
                </th>

                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Stock
                </th>

                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    Loading stock...
                  </td>
                </tr>
              ) : stocks.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    {hasFilter
                      ? "Tidak ada stock yang sesuai dengan filter."
                      : "Belum ada data stock."}
                  </td>
                </tr>
              ) : (
                stocks.map((stock) => {
                  const quantity = Number(stock.quantity);
                  const minimumStock = Number(stock.product.minimum_stock);

                  return (
                    <tr
                      key={stock.id}
                      className="transition hover:bg-gray-50"
                    >
                      {/* Product */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          {stock.product.image_url ? (
                            <img
                              src={stock.product.image_url}
                              alt={stock.product.name}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xs font-medium text-gray-500">
                              N/A
                            </div>
                          )}

                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {stock.product.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              {stock.product.unit?.name ?? "-"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                        {stock.product.sku}
                      </td>

                      {/* Warehouse */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {stock.warehouse.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {stock.warehouse.code}
                          </p>
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex flex-col items-end">
                          <span
                            className={`text-sm font-semibold ${
                              quantity <= minimumStock
                                ? "text-red-600"
                                : "text-gray-900"
                            }`}
                          >
                            {formatNumber(quantity)}
                          </span>

                          <span className="text-xs text-gray-500">
                            Min. {formatNumber(minimumStock)}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-6 py-4 text-center">
                        <StockStatus
                          quantity={quantity}
                          minimumStock={minimumStock}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockList;