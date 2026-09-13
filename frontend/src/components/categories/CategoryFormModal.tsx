import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  createCategory,
  updateCategory,
} from "../../services/categoryService";

import type {
  Category,
  CategoryFormData,
} from "../../types/category";

interface CategoryFormModalProps {
  open: boolean;
  category: Category | null;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}

const initialForm: CategoryFormData = {
  parent_id: null,
  name: "",
  slug: "",
  description: "",
};

function CategoryFormModal({
  open,
  category,
  categories,
  onClose,
  onSuccess,
}: CategoryFormModalProps) {
  const [form, setForm] =
    useState<CategoryFormData>(initialForm);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const isEditing = Boolean(category);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (category) {
      setForm({
        parent_id: category.parent_id,
        name: category.name,
        slug: category.slug,
        description: category.description ?? "",
      });
    } else {
      setForm(initialForm);
    }

    setError("");
  }, [open, category]);

  if (!open) {
    return null;
  }

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    if (name === "parent_id") {
      setForm((previous) => ({
        ...previous,
        parent_id: value ? Number(value) : null,
      }));

      return;
    }

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const generateSlug = () => {
    const slug = form.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    setForm((previous) => ({
      ...previous,
      slug,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Category name wajib diisi.");
      return;
    }

    if (!form.slug.trim()) {
      setError("Slug wajib diisi.");
      return;
    }

    if (
      category &&
      form.parent_id === category.id
    ) {
      setError(
        "Category tidak dapat menjadi parent dirinya sendiri."
      );
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        parent_id: form.parent_id,
        name: form.name.trim(),
        slug: form.slug.trim(),
        description:
          form.description.trim() || undefined,
      };

      if (category) {
        await updateCategory(
          category.id,
          payload
        );
      } else {
        await createCategory(payload);
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(
        "Failed to save category:",
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
              "Data category tidak valid."
          )
        );
      } else {
        setError(
          error?.response?.data?.message ||
            "Gagal menyimpan category."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const availableParents =
    categories.filter(
      (item) => item.id !== category?.id
    );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4">
      <div
        className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-form-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2
              id="category-form-title"
              className="text-lg font-semibold text-slate-900"
            >
              {isEditing
                ? "Edit Category"
                : "Add Category"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isEditing
                ? "Perbarui informasi category."
                : "Tambahkan category baru."}
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

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto"
        >
          <div className="space-y-5 p-6">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label
                htmlFor="category-name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Category Name
              </label>

              <input
                id="category-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                maxLength={100}
                placeholder="Contoh: Laptop"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            {/* Slug */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="category-slug"
                  className="block text-sm font-medium text-slate-700"
                >
                  Slug
                </label>

                <button
                  type="button"
                  onClick={generateSlug}
                  className="text-xs font-medium text-slate-500 hover:text-slate-900"
                >
                  Generate
                </button>
              </div>

              <input
                id="category-slug"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                maxLength={100}
                placeholder="laptop"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />

              <p className="mt-1.5 text-xs text-slate-400">
                Slug harus unik.
              </p>
            </div>

            {/* Parent */}
            <div>
              <label
                htmlFor="category-parent"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Parent Category
              </label>

              <select
                id="category-parent"
                name="parent_id"
                value={form.parent_id ?? ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                <option value="">
                  No Parent
                </option>

                {availableParents.map(
                  (item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  )
                )}
              </select>

              <p className="mt-1.5 text-xs text-slate-400">
                Kosongkan jika category merupakan root category.
              </p>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="category-description"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Description
              </label>

              <textarea
                id="category-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Deskripsi category..."
                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>
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
                  : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryFormModal;