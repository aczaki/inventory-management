import { useEffect, useState } from "react";

import { getProduct } from "../../services/productService";
import type { Product } from "../../types/product";

interface ProductDetailModalProps {
  open: boolean;
  productId: number | null;
  onClose: () => void;
}

const formatCurrency = (value: number | string) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
};

function ProductDetailModal({
  open,
  productId,
  onClose,
}: ProductDetailModalProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !productId) {
      setProduct(null);
      setError("");
      return;
    }

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProduct(productId);

        setProduct(response.data);
      } catch (error: any) {
        console.error(
          "Failed to load product detail:",
          error
        );

        setError(
          error?.response?.data?.message ||
            "Gagal mengambil detail product."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [open, productId]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center bg-slate-900/40 p-4">
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-detail-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2
              id="product-detail-title"
              className="text-lg font-semibold text-slate-900"
            >
              Product Detail
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Informasi lengkap product.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close product detail"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6l12 12M18 6 6 18"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6">
          {loading && (
            <div className="space-y-5">
              <div className="h-32 animate-pulse rounded-xl bg-slate-100" />

              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 6 }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="h-16 animate-pulse rounded-lg bg-slate-100"
                    />
                  )
                )}
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && product && (
            <div className="space-y-6">
              {/* Product overview */}
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="h-32 w-32 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold text-slate-900">
                      {product.name}
                    </h3>

                    <span
                      className={[
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        product.status === "active"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-600",
                      ].join(" ")}
                    >
                      {product.status === "active"
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    {product.description ||
                      "Tidak ada deskripsi product."}
                  </p>

                  <p className="mt-3 text-sm font-medium text-slate-700">
                    SKU:{" "}
                    <span className="font-normal text-slate-500">
                      {product.sku}
                    </span>
                  </p>
                </div>
              </div>

              {/* Details */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Product Information
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Barcode
                    </p>

                    <p className="mt-1.5 text-sm text-slate-700">
                      {product.barcode || "-"}
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Category
                    </p>

                    <p className="mt-1.5 text-sm text-slate-700">
                      {product.category?.name || "-"}
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Unit
                    </p>

                    <p className="mt-1.5 text-sm text-slate-700">
                      {product.unit?.name || "-"}
                    </p>

                    {product.unit?.code && (
                      <p className="mt-1 text-xs text-slate-400">
                        {product.unit.code}
                      </p>
                    )}
                  </div>

                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Minimum Stock
                    </p>

                    <p className="mt-1.5 text-sm font-medium text-slate-700">
                      {Number(
                        product.minimum_stock
                      ).toLocaleString("id-ID")}
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Purchase Price
                    </p>

                    <p className="mt-1.5 text-sm font-medium text-slate-700">
                      {formatCurrency(
                        product.default_purchase_price
                      )}
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Selling Price
                    </p>

                    <p className="mt-1.5 text-sm font-medium text-slate-700">
                      {formatCurrency(
                        product.selling_price
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="border-t border-slate-100 pt-5">
                <div className="grid gap-4 text-xs sm:grid-cols-2">
                  <div>
                    <p className="text-slate-400">
                      Created
                    </p>

                    <p className="mt-1 text-slate-600">
                      {new Intl.DateTimeFormat(
                        "id-ID",
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }
                      ).format(
                        new Date(product.created_at)
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">
                      Last Updated
                    </p>

                    <p className="mt-1 text-slate-600">
                      {new Intl.DateTimeFormat(
                        "id-ID",
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }
                      ).format(
                        new Date(product.updated_at)
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailModal;