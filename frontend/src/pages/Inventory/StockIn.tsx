import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import {
  getProducts,
} from "../../services/productService";

import {
  getWarehouses,
} from "../../services/warehouseService";

import {
  stockIn,
} from "../../services/inventoryStockService";

import type { Product } from "../../types/product";
import type { Warehouse } from "../../types/warehouse";

const StockIn = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  const [productId, setProductId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");

  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        setError("");

        const [
          productResponse,
          warehouseData,
        ] = await Promise.all([
          getProducts(),
          getWarehouses(),
        ]);

        setProducts(productResponse.data);
        setWarehouses(warehouseData);
      } catch (err) {
        console.error(err);
        setError(
          "Gagal mengambil data product atau warehouse."
        );
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!productId) {
      setError("Product wajib dipilih.");
      return;
    }

    if (!warehouseId) {
      setError("Warehouse wajib dipilih.");
      return;
    }

    const parsedQuantity = Number(quantity);

    if (
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity < 1
    ) {
      setError(
        "Quantity harus berupa bilangan bulat minimal 1."
      );
      return;
    }

    try {
      setSubmitting(true);

      await stockIn({
        product_id: Number(productId),
        warehouse_id: Number(warehouseId),
        quantity: parsedQuantity,
        reference_number:
          referenceNumber.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      setSuccess(
        "Stock berhasil ditambahkan."
      );

      setProductId("");
      setWarehouseId("");
      setQuantity("");
      setReferenceNumber("");
      setNotes("");
    } catch (err: any) {
      console.error(err);

      const message =
        err?.response?.data?.message ||
        "Gagal menambahkan stock.";

      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedProduct = products.find(
    (product) =>
      product.id === Number(productId)
  );

  const selectedWarehouse = warehouses.find(
    (warehouse) =>
      warehouse.id === Number(warehouseId)
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Stock In
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Tambahkan stock produk ke warehouse.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/inventory/stock")
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
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
              d="M10 19l-7-7m0 0 7-7m-7 7h18"
            />
          </svg>

          Back to Stock
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-base font-semibold text-slate-900">
                Stock In Form
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Masukkan informasi stock yang akan
                ditambahkan.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-5 px-6 py-6">
                {/* Error */}
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* Success */}
                {success && (
                  <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                    {success}
                  </div>
                )}

                {/* Loading */}
                {loadingData ? (
                  <div className="space-y-5">
                    <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
                    <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
                    <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
                  </div>
                ) : (
                  <>
                    {/* Product */}
                    <div>
                      <label
                        htmlFor="product"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                      >
                        Product{" "}
                        <span className="text-red-500">
                          *
                        </span>
                      </label>

                      <select
                        id="product"
                        value={productId}
                        onChange={(event) =>
                          setProductId(
                            event.target.value
                          )
                        }
                        disabled={submitting}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50"
                      >
                        <option value="">
                          Select product
                        </option>

                        {products
                          .filter(
                            (product) =>
                              product.status ===
                              "active"
                          )
                          .map((product) => (
                            <option
                              key={product.id}
                              value={product.id}
                            >
                              {product.sku} -{" "}
                              {product.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Warehouse */}
                    <div>
                      <label
                        htmlFor="warehouse"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                      >
                        Warehouse{" "}
                        <span className="text-red-500">
                          *
                        </span>
                      </label>

                      <select
                        id="warehouse"
                        value={warehouseId}
                        onChange={(event) =>
                          setWarehouseId(
                            event.target.value
                          )
                        }
                        disabled={submitting}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50"
                      >
                        <option value="">
                          Select warehouse
                        </option>

                        {warehouses
                          .filter(
                            (warehouse) =>
                              warehouse.status ===
                              "active"
                          )
                          .map((warehouse) => (
                            <option
                              key={warehouse.id}
                              value={warehouse.id}
                            >
                              {warehouse.code} -{" "}
                              {warehouse.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Quantity */}
                    <div>
                      <label
                        htmlFor="quantity"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                      >
                        Quantity{" "}
                        <span className="text-red-500">
                          *
                        </span>
                      </label>

                      <input
                        id="quantity"
                        type="number"
                        min="1"
                        step="1"
                        value={quantity}
                        onChange={(event) =>
                          setQuantity(
                            event.target.value
                          )
                        }
                        disabled={submitting}
                        placeholder="Enter quantity"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50"
                      />
                    </div>

                    {/* Reference */}
                    <div>
                      <label
                        htmlFor="reference_number"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                      >
                        Reference Number
                      </label>

                      <input
                        id="reference_number"
                        type="text"
                        maxLength={100}
                        value={referenceNumber}
                        onChange={(event) =>
                          setReferenceNumber(
                            event.target.value
                          )
                        }
                        disabled={submitting}
                        placeholder="Example: PO-2026-001"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50"
                      />
                    </div>

                    {/* Notes */}
                    <div>
                      <label
                        htmlFor="notes"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                      >
                        Notes
                      </label>

                      <textarea
                        id="notes"
                        rows={4}
                        maxLength={1000}
                        value={notes}
                        onChange={(event) =>
                          setNotes(
                            event.target.value
                          )
                        }
                        disabled={submitting}
                        placeholder="Additional notes..."
                        className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/inventory/stock")
                  }
                  disabled={submitting}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    loadingData || submitting
                  }
                  className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting
                    ? "Adding Stock..."
                    : "Add Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Transaction Summary
              </h2>
            </div>

            <div className="space-y-5 px-5 py-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Product
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {selectedProduct
                    ? selectedProduct.name
                    : "Not selected"}
                </p>

                {selectedProduct && (
                  <p className="mt-0.5 text-xs text-slate-500">
                    {selectedProduct.sku}
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Warehouse
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {selectedWarehouse
                    ? selectedWarehouse.name
                    : "Not selected"}
                </p>

                {selectedWarehouse && (
                  <p className="mt-0.5 text-xs text-slate-500">
                    {selectedWarehouse.code}
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Quantity
                </p>

                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  {quantity
                    ? Number(
                        quantity
                      ).toLocaleString("id-ID")
                    : "0"}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <p className="text-xs leading-5 text-slate-500">
                  Stock akan ditambahkan ke warehouse
                  yang dipilih setelah transaksi berhasil
                  diproses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockIn;