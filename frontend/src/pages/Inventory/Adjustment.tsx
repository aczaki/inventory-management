import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";

import { getProducts } from "../../services/productService";
import { getWarehouses } from "../../services/warehouseService";
import {
  adjustment,
  type StockAdjustmentRequest,
} from "../../services/inventoryStockService";
import { getInventoryStocks } from "../../services/inventoryStockService";

import type { Product } from "../../types/product";
import type { Warehouse } from "../../types/warehouse";
import type { InventoryStock } from "../../types/inventoryStock";

const Adjustment = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [stocks, setStocks] = useState<InventoryStock[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState<StockAdjustmentRequest>({
    product_id: 0,
    warehouse_id: 0,
    quantity: 0,
    reference_number: "",
    notes: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          productResponse,
          warehouseResponse,
          stockResponse,
        ] = await Promise.all([
          getProducts(),
          getWarehouses(),
          getInventoryStocks(),
        ]);

        setProducts(productResponse.data);
        setWarehouses(warehouseResponse);
        setStocks(stockResponse);
      } catch (err: any) {
        console.error(err);

        setError(
          err?.response?.data?.message ||
            "Gagal memuat data Adjustment."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const activeProducts = products.filter(
    (product) => product.status === "active"
  );

  const activeWarehouses = warehouses.filter(
    (warehouse) => warehouse.status === "active"
  );

  const selectedProduct = products.find(
    (product) => product.id === form.product_id
  );

  const selectedWarehouse = warehouses.find(
    (warehouse) => warehouse.id === form.warehouse_id
  );

  const currentStock = stocks.find(
    (stock) =>
      stock.product_id === form.product_id &&
      stock.warehouse_id === form.warehouse_id
  );

  const currentQuantity = currentStock
    ? Number(currentStock.quantity)
    : 0;

  const adjustmentQuantity = Number(form.quantity);

  const stockDifference =
    adjustmentQuantity - currentQuantity;

  const handleChange = (
    field: keyof StockAdjustmentRequest,
    value: string | number
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.product_id) {
      setError("Silakan pilih produk.");
      return;
    }

    if (!form.warehouse_id) {
      setError("Silakan pilih warehouse.");
      return;
    }

    if (form.quantity < 0) {
      setError("Quantity tidak boleh kurang dari 0.");
      return;
    }

    try {
      setSubmitting(true);

      await adjustment({
        product_id: form.product_id,
        warehouse_id: form.warehouse_id,
        quantity: form.quantity,
        reference_number:
          form.reference_number?.trim() || undefined,
        notes: form.notes?.trim() || undefined,
      });

      setSuccess("Stock berhasil disesuaikan.");

      setTimeout(() => {
        navigate("/inventory/stock");
      }, 1000);
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Gagal melakukan Adjustment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-7 w-40 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-[520px] animate-pulse rounded-2xl bg-slate-100 lg:col-span-2" />
          <div className="h-[350px] animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Stock Adjustment
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Sesuaikan jumlah stock aktual dengan stock sistem.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/inventory/stock")}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>

          Kembali ke Stock
        </button>
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

      {/* Success */}
      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <svg
            className="mt-0.5 h-5 w-5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12l4 4L19 6"
            />
          </svg>

          <span>{success}</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2"
        >
          <div className="mb-6">
            <h2 className="text-base font-semibold text-slate-900">
              Adjustment Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Masukkan jumlah stock aktual yang seharusnya
              tersimpan di warehouse.
            </p>
          </div>

          <div className="space-y-5">
            {/* Product */}
            <div>
              <label
                htmlFor="product_id"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Product <span className="text-red-500">*</span>
              </label>

              <select
                id="product_id"
                value={form.product_id || ""}
                onChange={(event) =>
                  handleChange(
                    "product_id",
                    Number(event.target.value)
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              >
                <option value="">Pilih product</option>

                {activeProducts.map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.sku} - {product.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Warehouse */}
            <div>
              <label
                htmlFor="warehouse_id"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Warehouse <span className="text-red-500">*</span>
              </label>

              <select
                id="warehouse_id"
                value={form.warehouse_id || ""}
                onChange={(event) =>
                  handleChange(
                    "warehouse_id",
                    Number(event.target.value)
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              >
                <option value="">Pilih warehouse</option>

                {activeWarehouses.map((warehouse) => (
                  <option
                    key={warehouse.id}
                    value={warehouse.id}
                  >
                    {warehouse.code} - {warehouse.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label
                htmlFor="quantity"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Actual Stock Quantity{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                id="quantity"
                type="number"
                min="0"
                value={form.quantity}
                onChange={(event) =>
                  handleChange(
                    "quantity",
                    Math.max(0, Number(event.target.value))
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />

              <p className="mt-2 text-xs text-slate-500">
                Masukkan jumlah stock aktual, bukan jumlah
                perubahan stock.
              </p>
            </div>

            {/* Reference Number */}
            <div>
              <label
                htmlFor="reference_number"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Reference Number
                <span className="ml-1 text-xs font-normal text-slate-400">
                  (Opsional)
                </span>
              </label>

              <input
                id="reference_number"
                type="text"
                value={form.reference_number}
                onChange={(event) =>
                  handleChange(
                    "reference_number",
                    event.target.value
                  )
                }
                placeholder="Contoh: ADJ-20260921-001"
                maxLength={100}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Notes
                <span className="ml-1 text-xs font-normal text-slate-400">
                  (Opsional)
                </span>
              </label>

              <textarea
                id="notes"
                value={form.notes}
                onChange={(event) =>
                  handleChange("notes", event.target.value)
                }
                rows={4}
                maxLength={1000}
                placeholder="Jelaskan alasan adjustment..."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/inventory/stock")}
              disabled={submitting}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Processing...
                </>
              ) : (
                "Save Adjustment"
              )}
            </button>
          </div>
        </form>

        {/* Summary */}
        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Adjustment Summary
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Perbandingan stock sistem dan stock aktual.
          </p>

          <div className="mt-6 space-y-5">
            {/* Product */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Product
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {selectedProduct?.name || "-"}
              </p>

              {selectedProduct && (
                <p className="mt-0.5 text-xs text-slate-500">
                  {selectedProduct.sku}
                </p>
              )}
            </div>

            {/* Warehouse */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Warehouse
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {selectedWarehouse?.name || "-"}
              </p>

              {selectedWarehouse && (
                <p className="mt-0.5 text-xs text-slate-500">
                  {selectedWarehouse.code}
                </p>
              )}
            </div>

            {/* Current Stock */}
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Current Stock
              </p>

              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {currentStock ? currentQuantity : "0"}
              </p>
            </div>

            {/* Actual Stock */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Actual Stock
              </p>

              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {adjustmentQuantity}
              </p>
            </div>

            {/* Difference */}
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Difference
              </p>

              <p
                className={`mt-1 text-xl font-semibold ${
                  stockDifference > 0
                    ? "text-green-600"
                    : stockDifference < 0
                      ? "text-red-600"
                      : "text-slate-900"
                }`}
              >
                {stockDifference > 0 ? "+" : ""}
                {stockDifference}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {stockDifference > 0
                  ? "Stock akan bertambah."
                  : stockDifference < 0
                    ? "Stock akan berkurang."
                    : "Tidak ada perubahan stock."}
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex gap-3">
              <svg
                className="h-5 w-5 shrink-0 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="9" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 10v6m0-9h.01"
                />
              </svg>

              <p className="text-xs leading-5 text-blue-700">
                Adjustment akan mengganti stock sistem
                dengan jumlah actual stock yang kamu masukkan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adjustment;