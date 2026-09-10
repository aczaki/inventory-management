import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  deleteProduct,
  getProducts,
} from "../../services/productService";

import type { Product } from "../../types/product";

import {
  getCategories,
  type Category,
} from "../../services/categoryService";

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

const PER_PAGE = 10;

function ProductList() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [filterLoading, setFilterLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [categoryId, setCategoryId] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [hasNextPage, setHasNextPage] =
    useState(false);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const [productToDelete, setProductToDelete] =
    useState<Product | null>(null);

  const searchTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  const loadCategories = async () => {
    try {
      const response =
        await getCategories();

      setCategories(response.data);
    } catch (error) {
      console.error(
        "Failed to load categories:",
        error
      );
    }
  };

  const loadProducts = useCallback(
    async (
      targetPage: number = page,
      options?: {
        searchValue?: string;
        categoryValue?: string;
        statusValue?: string;
        isFilter?: boolean;
      }
    ) => {
      const currentSearch =
        options?.searchValue ?? search;

      const currentCategory =
        options?.categoryValue ?? categoryId;

      const currentStatus =
        options?.statusValue ?? status;

      try {
        if (options?.isFilter) {
          setFilterLoading(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response =
          await getProducts({
            search: currentSearch.trim() || undefined,
            category_id: currentCategory
              ? Number(currentCategory)
              : undefined,
            status:
              currentStatus === "active" ||
              currentStatus === "inactive"
                ? currentStatus
                : undefined,
            sort_by: "created_at",
            sort_direction: "desc",
            per_page: PER_PAGE,
            page: targetPage,
          });

        const nextProducts = response.data;

        /*
         * Backend tidak mengirim pagination metadata.
         * Selama jumlah data sama dengan PER_PAGE,
         * kita menganggap kemungkinan masih ada next page.
         */
        setHasNextPage(
          nextProducts.length === PER_PAGE
        );

        /*
         * Bila halaman berikutnya ternyata kosong,
         * jangan pindahkan user ke halaman kosong.
         */
        if (
          targetPage > 1 &&
          nextProducts.length === 0
        ) {
          setHasNextPage(false);
          return false;
        }

        setProducts(nextProducts);
        setPage(targetPage);

        return true;
      } catch (error: any) {
        console.error(
          "Failed to load products:",
          error
        );

        setError(
          error?.response?.data?.message ||
            "Gagal mengambil data products."
        );

        return false;
      } finally {
        setLoading(false);
        setFilterLoading(false);
      }
    },
    [page, search, categoryId, status]
  );

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts(1);
  }, []);

  useEffect(() => {
    if (!searchInput.trim()) {
      setSearch("");

      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(
        searchTimeoutRef.current
      );
    }

    searchTimeoutRef.current =
      setTimeout(() => {
        setSearch(
          searchInput.trim()
        );
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
    if (
      search === "" &&
      searchInput.trim() !== ""
    ) {
      return;
    }

    loadProducts(1, {
      searchValue: search,
      categoryValue: categoryId,
      statusValue: status,
      isFilter: true,
    });
  }, [search, categoryId, status]);

  const handleCategoryChange = (
    value: string
  ) => {
    setCategoryId(value);
  };

  const handleStatusChange = (
    value: string
  ) => {
    setStatus(value);
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setSearch("");
    setCategoryId("");
    setStatus("");
    setPage(1);
  };

  const handlePreviousPage = () => {
    if (page <= 1) {
      return;
    }

    loadProducts(page - 1, {
      isFilter: false,
    });
  };

  const handleNextPage = async () => {
    if (!hasNextPage) {
      return;
    }

    await loadProducts(page + 1, {
      isFilter: false,
    });
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (
    product: Product
  ) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleDelete = (
    product: Product
  ) => {
    setProductToDelete(product);
  };

  const confirmDelete = async () => {
    if (!productToDelete) {
      return;
    }

    try {
      setDeletingId(
        productToDelete.id
      );

      setError("");

      await deleteProduct(
        productToDelete.id
      );

      setProductToDelete(null);

      /*
       * Reload halaman saat ini.
       * Kalau ternyata halaman menjadi kosong,
       * kembali ke page sebelumnya.
       */
      const success =
        await loadProducts(page);

      if (
        success &&
        products.length === 1 &&
        page > 1
      ) {
        await loadProducts(page - 1);
      }
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

  const handleFormSuccess =
    async () => {
      await loadProducts(1);
    };

  if (
    loading &&
    products.length === 0
  ) {
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
            {Array.from({
              length: 5,
            }).map((_, index) => (
              <div
                key={index}
                className="h-12 animate-pulse rounded-lg bg-slate-100"
              />
            ))}
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

      {/* Filters */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_180px_auto]">
          {/* Search */}
          <div>
            <label
              htmlFor="product-search"
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
                id="product-search"
                type="text"
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(
                    event.target.value
                  )
                }
                placeholder="Search product, SKU..."
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category-filter"
              className="mb-2 block text-xs font-medium text-slate-500"
            >
              Category
            </label>

            <select
              id="category-filter"
              value={categoryId}
              onChange={(event) =>
                handleCategoryChange(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">
                All Categories
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status-filter"
              className="mb-2 block text-xs font-medium text-slate-500"
            >
              Status
            </label>

            <select
              id="status-filter"
              value={status}
              onChange={(event) =>
                handleStatusChange(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">
                All Status
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>
          </div>

          {/* Reset */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleResetFilters}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 lg:w-auto"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Filter loading */}
      {filterLoading && (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />

          Updating products...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
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
                No products found
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Coba ubah pencarian atau filter.
              </p>

              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <>
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
                  {products.map(
                    (product) => (
                      <tr
                        key={product.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                              {product.image_url ? (
                                <img
                                  src={
                                    product.image_url
                                  }
                                  alt={
                                    product.name
                                  }
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

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {product.sku}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {product.category
                            ?.name || "-"}
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-600">
                            {product.unit
                              ?.name || "-"}
                          </p>

                          {product.unit
                            ?.code && (
                            <p className="mt-1 text-xs text-slate-400">
                              {
                                product
                                  .unit
                                  .code
                              }
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4 text-right text-sm font-medium text-slate-700">
                          {formatCurrency(
                            product.selling_price
                          )}
                        </td>

                        <td className="px-5 py-4 text-right text-sm text-slate-600">
                          {Number(
                            product.minimum_stock
                          ).toLocaleString(
                            "id-ID"
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={[
                              "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                              product.status ===
                                "active"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-slate-100 text-slate-600",
                            ].join(" ")}
                          >
                            {product.status ===
                            "active"
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(
                                  product
                                )
                              }
                              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  product
                                )
                              }
                              disabled={
                                deletingId ===
                                product.id
                              }
                              className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingId ===
                              product.id
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
            <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Page{" "}
                <span className="font-medium text-slate-700">
                  {page}
                </span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={
                    handlePreviousPage
                  }
                  disabled={
                    page === 1 ||
                    filterLoading
                  }
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={
                    handleNextPage
                  }
                  disabled={
                    !hasNextPage ||
                    filterLoading
                  }
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation */}
      {productToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 p-4">
          <div
            className="w-full max-w-md rounded-2xl bg-white shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-product-title"
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
              <h2
                id="delete-product-title"
                className="text-lg font-semibold text-slate-900"
              >
                Delete Product?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Apakah kamu yakin ingin menghapus{" "}
                <span className="font-semibold text-slate-700">
                  "{productToDelete.name}"
                </span>
                ?
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setProductToDelete(null)
                }
                disabled={
                  deletingId !== null
                }
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={
                  deletingId !== null
                }
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

      {/* Create / Edit Modal */}
      <ProductFormModal
        open={modalOpen}
        product={selectedProduct}
        onClose={() => {
          setModalOpen(false);
          setSelectedProduct(null);
        }}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}

export default ProductList;