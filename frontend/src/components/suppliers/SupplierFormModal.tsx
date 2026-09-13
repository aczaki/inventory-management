import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  createSupplier,
  updateSupplier,
} from "../../services/supplierService";

import type {
  Supplier,
  SupplierFormData,
} from "../../types/supplier";

interface SupplierFormModalProps {
  open: boolean;
  supplier: Supplier | null;
  onClose: () => void;
  onSuccess: () => void;
}

const initialForm: SupplierFormData = {
  code: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  contact_person: "",
  status: "active",
};

function SupplierFormModal({
  open,
  supplier,
  onClose,
  onSuccess,
}: SupplierFormModalProps) {
  const [form, setForm] =
    useState<SupplierFormData>(
      initialForm
    );

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const isEditing = Boolean(supplier);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (supplier) {
      setForm({
        code: supplier.code,
        name: supplier.name,
        email: supplier.email ?? "",
        phone: supplier.phone ?? "",
        address: supplier.address ?? "",
        contact_person:
          supplier.contact_person ?? "",
        status:
          supplier.status === "inactive"
            ? "inactive"
            : "active",
      });
    } else {
      setForm(initialForm);
    }

    setError("");
  }, [open, supplier]);

  if (!open) {
    return null;
  }

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!form.code.trim()) {
      setError("Supplier code wajib diisi.");
      return;
    }

    if (!form.name.trim()) {
      setError("Supplier name wajib diisi.");
      return;
    }

    if (
      form.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      setError(
        "Format email supplier tidak valid."
      );
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        code: form.code.trim(),
        name: form.name.trim(),
        email:
          form.email.trim() || undefined,
        phone:
          form.phone.trim() || undefined,
        address:
          form.address.trim() || undefined,
        contact_person:
          form.contact_person.trim() ||
          undefined,
        status: form.status,
      };

      if (supplier) {
        await updateSupplier(
          supplier.id,
          payload
        );
      } else {
        await createSupplier(payload);
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(
        "Failed to save supplier:",
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
              "Data supplier tidak valid."
          )
        );
      } else {
        setError(
          error?.response?.data?.message ||
            "Gagal menyimpan supplier."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4">
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="supplier-form-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2
              id="supplier-form-title"
              className="text-lg font-semibold text-slate-900"
            >
              {isEditing
                ? "Edit Supplier"
                : "Add Supplier"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isEditing
                ? "Perbarui informasi supplier."
                : "Tambahkan supplier baru."}
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

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Code */}
              <div>
                <label
                  htmlFor="supplier-code"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Supplier Code
                </label>

                <input
                  id="supplier-code"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  maxLength={20}
                  placeholder="SUP-001"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="supplier-name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Supplier Name
                </label>

                <input
                  id="supplier-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  maxLength={150}
                  placeholder="PT Supplier Indonesia"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* Contact person */}
              <div>
                <label
                  htmlFor="supplier-contact"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Contact Person
                </label>

                <input
                  id="supplier-contact"
                  name="contact_person"
                  value={form.contact_person}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="Nama kontak"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="supplier-email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email
                </label>

                <input
                  id="supplier-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="supplier@example.com"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="supplier-phone"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Phone
                </label>

                <input
                  id="supplier-phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={20}
                  placeholder="081234567890"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="supplier-status"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Status
                </label>

                <select
                  id="supplier-status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                >
                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="supplier-address"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Address
              </label>

              <textarea
                id="supplier-address"
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={4}
                placeholder="Alamat supplier..."
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
                  : "Create Supplier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SupplierFormModal;