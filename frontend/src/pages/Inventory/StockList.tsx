import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getInventoryStocks,
} from "../../services/inventoryStockService";

import {
  getWarehouses,
  type Warehouse,
} from "../../services/warehouseService";

import type {
  InventoryStock,
} from "../../types/inventoryStock";

import StockStatus from "../../components/inventory/StockStatus";

const PER_PAGE = 10;

function StockList() {
  const [stocks, setStocks] =
    useState<InventoryStock[]>([]);

  const [warehouses, setWarehouses] =
    useState<Warehouse[]>([]);

  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [warehouseId, setWarehouseId] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [filterLoading, setFilterLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const searchTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  const loadWarehouses = async () => {
    try {
      const response =
        await getWarehouses();

      setWarehouses(response.data);
    } catch (error) {
      console.error(
        "Failed to load warehouses:",
        error
      );
    }
  };

  const loadStocks = async (
    filterRequest = false
  ) => {
    try {
      if (filterRequest) {
        setFilterLoading(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response =
        await getInventoryStocks({
          search:
            search.trim() || undefined,

          warehouse_id: warehouseId
            ? Number(warehouseId)
            : undefined,
        });

      setStocks(response.data);
    } catch (error: any) {
      console.error(
        "Failed to load inventory stocks:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Gagal mengambil daftar stock."
      );
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  };

  useEffect(() => {
    loadWarehouses();
    loadStocks();
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(
        searchTimeoutRef.current
      );
    }

    searchTimeoutRef.current =
      setTimeout(() => {
        setSearch(searchInput.trim());
      }, 400);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(
          searchTimeoutRef.current
        );
      }
    };
  }, [searchInput]);

  useEffect(() => {
    if (!loading) {
      loadStocks(true);
    }
  }, [search, warehouseId]);

  const handleReset = () => {
    setSearchInput("");
    setSearch("");
    setWarehouseId("");
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-end justify-between">
          <div>
            <div className="h-8 w-24 animate-pulse rounded-md bg-slate-200" />

            <div className="mt-2 h-4 w-72 animate-pulse rounded-md bg-slate-200" />
          </div>

          <div className="h-10 w-24 animate-pulse rounded-lg bg-slate-200" />
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-10 animate-pulse rounded-lg bg-slate-100" />

            <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <div className="space-y-4">
            {Array.from({ length: 6 }).map(
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
            Stock
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Monitor current inventory across warehouses.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadStocks(true)}
          disabled={filterLoading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={[
              "h-4 w-4",
              filterLoading
                ? "animate-spin"
                : "",
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

          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_260px_auto]">
          {/* Search */}
          <div>
            <label
              htmlFor="stock-search"
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
                id="stock-search"
                type="text"
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(
                    event.target.value
                  )
                }
                placeholder="Search product or SKU..."
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>

          {/* Warehouse */}
          <div>
            <label
              htmlFor="warehouse-filter"
              className="mb-2 block text-xs font-medium text-slate-500"
            >
              Warehouse
            </label>

            <select
              id="warehouse-filter"
              value={warehouseId}
              onChange={(event) =>
                setWarehouseId(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">
                All Warehouses
              </option>

              {warehouses.map(
                (warehouse) => (
                  <option
                    key={warehouse.id}
                    value={warehouse.id}
                  >
                    {warehouse.name}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Reset */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleReset}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 md:w-auto"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {stocks.length === 0 ? (
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10 12 3l9 7v10H3V10Z"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 21v-7h10v7"
                  />
                </svg>
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-800">
                No stock found
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Coba ubah pencarian atau warehouse filter.
              </p>

              <button
                type="button"
                onClick={handleReset}
                className="mt-4 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Product
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      SKU
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Warehouse
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Stock
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {stocks.map(
                    (stock) => (
                      <tr
                        key={stock.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                      >
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-slate-800">
                            {stock.product
                              .name}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {stock.product.sku}
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-700">
                            {
                              stock
                                .warehouse
                                .name
                            }
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {
                              stock
                                .warehouse
                                .code
                            }
                          </p>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <span className="text-sm font-semibold text-slate-800">
                            {Number(
                              stock.quantity
                            ).toLocaleString(
                              "id-ID"
                            )}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <StockStatus
                            quantity={
                              stock.quantity
                            }
                            minimumStock={
                              stock
                                .product
                                .minimum_stock
                            }
                          />
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StockList;