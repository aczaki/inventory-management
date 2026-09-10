import { useEffect, useState } from "react";

import {
  deleteProduct,
  getProducts,
} from "../../services/productService";

import type { Product } from "../../types/product";

import ProductFormModal from "../../components/products/ProductFormModal";

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
  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);
  
  const [productToDelete, setProductToDelete] =
  useState<Product | null>(null);

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

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAdd = () => {
    setSelectedProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleDelete = (product: Product) => {
  setProductToDelete(product);
};

  const confirmDelete = async () => {
    if (!productToDelete) {
      return;
    }

    try {
      setDeletingId(productToDelete.id);
      setError("");

      await deleteProduct(productToDelete.id);

      setProductToDelete(null);

      await loadProducts();
    } catch (error: any) {
      console.error(
        "Failed to delete product:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Gagal menghapus product."
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

          <div className="h-10 w-32 animate-pulse rounded-lg bg-slate-200" />
        </div>

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
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <span className="text-lg leading-none">
            +
          </span>

          Add Product
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

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
                Tambahkan product pertama kamu.
              </p>

              <button
                type="button"
                onClick={handleAdd}
                className="mt-4 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                Add Product
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
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
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {product.sku}
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {product.category?.name ||
                        "-"}
                    </td>

                    {/* Unit */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-600">
                        {product.unit?.name || "-"}
                      </p>

                      {product.unit?.code && (
                        <p className="mt-1 text-xs text-slate-400">
                          {product.unit.code}
                        </p>
                      )}
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4 text-right text-sm font-medium text-slate-700">
                      {formatCurrency(
                        product.selling_price
                      )}
                    </td>

                    {/* Minimum stock */}
                    <td className="px-5 py-4 text-right text-sm text-slate-600">
                      {Number(
                        product.minimum_stock
                      ).toLocaleString("id-ID")}
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

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(product)
                          }
                          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(product)
                          }
                          disabled={
                            deletingId === product.id
                          }
                          className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId ===
                          product.id
                            ? "..."
                            : "Delete"}
                            {productToDelete && (
                                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 p-4">
                                  <div
                                    className="w-full max-w-md rounded-2xl bg-white shadow-xl"
                                    role="dialog"
                                    aria-modal="true"
                                    aria-labelledby="delete-product-title"
                                  >
                                    {/* Icon */}
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

                                    {/* Content */}
                                    <div className="px-6 pb-6 pt-5 text-center">
                                      <h2
                                        id="delete-product-title"
                                        className="text-lg font-semibold text-slate-900"
                                      >
                                        Delete Product?
                                      </h2>

                                      <p className="mt-2 text-sm leading-6 text-slate-500">
                                        Apakah kamu yakin ingin menghapus product{" "}
                                        <span className="font-semibold text-slate-700">
                                          "{productToDelete.name}"
                                        </span>
                                        ?
                                      </p>

                                      <p className="mt-2 text-xs text-slate-400">
                                        Tindakan ini akan menghapus product dari daftar
                                        inventory.
                                      </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
                                      <button
                                        type="button"
                                        onClick={() => setProductToDelete(null)}
                                        disabled={deletingId !== null}
                                        className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                      >
                                        Cancel
                                      </button>

                                      <button
                                        type="button"
                                        onClick={confirmDelete}
                                        disabled={deletingId !== null}
                                        className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                      >
                                        {deletingId !== null
                                          ? "Deleting..."
                                          : "Delete Product"}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <ProductFormModal
        open={modalOpen}
        product={selectedProduct}
        onClose={() => {
          setModalOpen(false);
          setSelectedProduct(null);
        }}
        onSuccess={loadProducts}
      />
    </div>
  );
}

export default ProductList;