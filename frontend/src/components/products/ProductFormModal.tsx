import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  createProduct,
  updateProduct,
} from "../../services/productService";

import {
  getCategories,
} from "../../services/categoryService";

import type { Category } from "../../types/category";

import type {
  Product,
  ProductFormData,
} from "../../types/product";

interface ProductFormModalProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

const initialForm: ProductFormData = {
  category_id: 0,
  unit_id: 0,
  sku: "",
  barcode: "",
  name: "",
  description: "",
  default_purchase_price: 0,
  selling_price: 0,
  minimum_stock: 0,
  status: "active",
  image: null,
};

function ProductFormModal({
  open,
  product,
  onClose,
  onSuccess,
}: ProductFormModalProps) {
  const [form, setForm] =
    useState<ProductFormData>(initialForm);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loadingCategories, setLoadingCategories] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const isEditing = Boolean(product);

  useEffect(() => {
    if (!open) {
      return;
    }

    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        setError("");

        const response = await getCategories();

        setCategories(response.data);
      } catch (error: any) {
        console.error(
          "Failed to load categories:",
          error
        );

        setError(
          error?.response?.data?.message ||
            "Gagal mengambil data category."
        );
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();

    if (product) {
      setForm({
        category_id: product.category?.id ?? 0,
        unit_id: product.unit?.id ?? 0,
        sku: product.sku,
        barcode: product.barcode ?? "",
        name: product.name,
        description: product.description ?? "",
        default_purchase_price: Number(
          product.default_purchase_price
        ),
        selling_price: Number(
          product.selling_price
        ),
        minimum_stock: Number(
          product.minimum_stock
        ),
        status:
          product.status === "inactive"
            ? "inactive"
            : "active",
        image: null,
      });

      setImagePreview(
        product.image_url || null
      );
    } else {
      setForm(initialForm);
      setImagePreview(null);
    }
  }, [open, product]);

  if (!open) {
    return null;
  }

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    if (name === "category_id") {
      setForm((previous) => ({
        ...previous,
        category_id: Number(value),
      }));

      return;
    }

    if (name === "unit_id") {
      setForm((previous) => ({
        ...previous,
        unit_id: Number(value),
      }));

      return;
    }

    if (
      name === "default_purchase_price" ||
      name === "selling_price" ||
      name === "minimum_stock"
    ) {
      setForm((previous) => ({
        ...previous,
        [name]: Number(value),
      }));

      return;
    }

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Format image harus JPG, JPEG, PNG, atau WEBP."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError(
        "Ukuran image maksimal adalah 2 MB."
      );

      event.target.value = "";
      return;
    }

    setError("");

    setForm((previous) => ({
      ...previous,
      image: file,
    }));

    setImagePreview(
      URL.createObjectURL(file)
    );
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!form.category_id) {
      setError("Category wajib dipilih.");
      return;
    }

    if (!form.unit_id) {
      setError("Unit ID wajib diisi.");
      return;
    }

    if (!form.sku.trim()) {
      setError("SKU wajib diisi.");
      return;
    }

    if (!form.name.trim()) {
      setError("Product name wajib diisi.");
      return;
    }

    if (
      form.default_purchase_price < 0
    ) {
      setError(
        "Purchase price tidak boleh kurang dari 0."
      );
      return;
    }

    if (
      form.selling_price <
      form.default_purchase_price
    ) {
      setError(
        "Selling price harus lebih besar atau sama dengan purchase price."
      );
      return;
    }

    if (form.minimum_stock < 0) {
      setError(
        "Minimum stock tidak boleh kurang dari 0."
      );
      return;
    }

    try {
      setSubmitting(true);

      if (product) {
        await updateProduct(product.id, form);
      } else {
        await createProduct(form);
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(
        "Failed to save product:",
        error
      );

      const validationErrors =
        error?.response?.data?.errors;

      if (validationErrors) {
        const firstError =
          Object.values(validationErrors)
            .flat()
            .at(0);

        setError(
          String(
            firstError ||
              "Data Product tidak valid."
          )
        );
      } else {
        setError(
          error?.response?.data?.message ||
            "Gagal menyimpan Product."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4">
      <div className="flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {isEditing
                ? "Edit Product"
                : "Add Product"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isEditing
                ? "Perbarui informasi product."
                : "Tambahkan product baru ke inventory."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close modal"
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
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto"
        >
          <div className="space-y-6 p-6">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Basic Information */}
            <section>
              <h3 className="text-sm font-semibold text-slate-900">
                Basic Information
              </h3>

              <div className="mt-4 grid gap-5 md:grid-cols-2">
                {/* Product name */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Product Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Contoh: Laptop Lenovo ThinkPad"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label
                    htmlFor="sku"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    SKU
                  </label>

                  <input
                    id="sku"
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    placeholder="LAPTOP-004"
                    maxLength={50}
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                {/* Barcode */}
                <div>
                  <label
                    htmlFor="barcode"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Barcode
                  </label>

                  <input
                    id="barcode"
                    name="barcode"
                    value={form.barcode}
                    onChange={handleChange}
                    placeholder="Optional"
                    maxLength={100}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>
            </section>

            {/* Classification */}
            <section>
              <h3 className="text-sm font-semibold text-slate-900">
                Classification
              </h3>

              <div className="mt-4 grid gap-5 md:grid-cols-2">
                {/* Category */}
                <div>
                  <label
                    htmlFor="category_id"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Category
                  </label>

                  <select
                    id="category_id"
                    name="category_id"
                    value={form.category_id || ""}
                    onChange={handleChange}
                    disabled={loadingCategories}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
                  >
                    <option value="">
                      {loadingCategories
                        ? "Loading categories..."
                        : "Select category"}
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

                {/* Unit */}
                <div>
                  <label
                    htmlFor="unit_id"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Unit ID
                  </label>

                  <input
                    id="unit_id"
                    name="unit_id"
                    type="number"
                    min="1"
                    value={
                      form.unit_id || ""
                    }
                    onChange={handleChange}
                    placeholder="Contoh: 1"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />

                  <p className="mt-1.5 text-xs text-slate-400">
                    Unit ID wajib sesuai dengan data Unit di backend.
                  </p>
                </div>
              </div>
            </section>

            {/* Pricing */}
            <section>
              <h3 className="text-sm font-semibold text-slate-900">
                Pricing & Stock
              </h3>

              <div className="mt-4 grid gap-5 md:grid-cols-3">
                {/* Purchase */}
                <div>
                  <label
                    htmlFor="default_purchase_price"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Purchase Price
                  </label>

                  <input
                    id="default_purchase_price"
                    name="default_purchase_price"
                    type="number"
                    min="0"
                    step="1"
                    value={
                      form.default_purchase_price
                    }
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                {/* Selling */}
                <div>
                  <label
                    htmlFor="selling_price"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Selling Price
                  </label>

                  <input
                    id="selling_price"
                    name="selling_price"
                    type="number"
                    min={form.default_purchase_price}
                    step="1"
                    value={form.selling_price}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                {/* Minimum */}
                <div>
                  <label
                    htmlFor="minimum_stock"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Minimum Stock
                  </label>

                  <input
                    id="minimum_stock"
                    name="minimum_stock"
                    type="number"
                    min="0"
                    step="1"
                    value={form.minimum_stock}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>
            </section>

            {/* Status & Image */}
            <section>
              <h3 className="text-sm font-semibold text-slate-900">
                Status & Image
              </h3>

              <div className="mt-4 grid gap-5 md:grid-cols-2">
                {/* Status */}
                <div>
                  <label
                    htmlFor="status"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Status
                  </label>

                  <select
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  >
                    <option value="active">
                      Active
                    </option>

                    <option value="inactive">
                      Inactive
                    </option>
                  </select>
                </div>

                {/* Image */}
                <div>
                  <label
                    htmlFor="image"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Product Image
                  </label>

                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="block w-full rounded-lg border border-slate-300 bg-white text-sm text-slate-500 file:mr-4 file:border-0 file:bg-slate-100 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
                  />

                  <p className="mt-1.5 text-xs text-slate-400">
                    JPG, JPEG, PNG, WEBP. Maksimal 2 MB.
                  </p>
                </div>
              </div>

              {imagePreview && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium text-slate-500">
                    Image Preview
                  </p>

                  <div className="h-24 w-24 overflow-hidden rounded-lg border border-slate-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Description */}
            <section>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-slate-900"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Tambahkan deskripsi product..."
                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </section>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductFormModal;