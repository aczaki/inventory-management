import { useEffect, useState } from "react";

import { getProducts } from "../../services/productService";
import type { Product } from "../../types/product";

const formatCurrency = (
  value: number | string
) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
};

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts();

        setProducts(response.data);
      } catch (error: any) {
        console.error(
          "Failed to load products:",
          error
        );

        setError(
          error?.response?.data?.message ||
            "Gagal mengambil data products."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="h-8 w-32 animate-pulse rounded-md bg-slate-200" />

        <div className="mt-2 h-4 w-56 animate-pulse rounded-md bg-slate-200" />

        <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="space-y-4 p-6">
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

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Products
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Kelola produk inventory.
        </p>

        <div className="mt-8 rounded-xl border border-red-200 bg-white p-6">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>
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
            Products
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Kelola produk yang tersedia dalam inventory.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <span className="text-lg leading-none">
            +
          </span>

          Add Product
        </button>
      </div>

      {/* Table */}
      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {products.length === 0 ? (
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
                    d="m3 7 9-4 9 4-9 4-9-4Z"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 7v10l9 4 9-4V7"
                  />
                </svg>
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-800">
                Belum ada product
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Product yang dibuat akan muncul di sini.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Product
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    SKU
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Category
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Unit
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Selling Price
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Min. Stock
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
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                  >
                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                              No Img
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-800">
                            {product.name}
                          </p>

                          <p className="mt-1 max-w-xs truncate text-xs text-slate-400">
                            {product.description ||
                              "No description"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600">
                        {product.sku}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600">
                        {product.category?.name ||
                          "-"}
                      </span>
                    </td>

                    {/* Unit */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm text-slate-600">
                          {product.unit?.name || "-"}
                        </p>

                        {product.unit?.code && (
                          <p className="mt-1 text-xs text-slate-400">
                            {product.unit.code}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4 text-right">
                      <span className="text-sm font-medium text-slate-700">
                        {formatCurrency(
                          product.selling_price
                        )}
                      </span>
                    </td>

                    {/* Minimum stock */}
                    <td className="px-5 py-4 text-right">
                      <span className="text-sm text-slate-600">
                        {Number(
                          product.minimum_stock
                        ).toLocaleString("id-ID")}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={[
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                          product.status === "active"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-600",
                        ].join(" ")}
                      >
                        {product.status === "active"
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductList;