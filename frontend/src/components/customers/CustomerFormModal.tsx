import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  createCustomer,
  updateCustomer,
} from "../../services/customerService";

import type {
  Customer,
  CustomerFormData,
} from "../../types/customer";

interface CustomerFormModalProps {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  onSuccess: () => void;
}

const initialForm: CustomerFormData = {
  code: "",
  business_name: "",
  contact_person: "",
  email: "",
  phone: "",
  address: "",
};

function CustomerFormModal({
  open,
  customer,
  onClose,
  onSuccess,
}: CustomerFormModalProps) {
  const [form, setForm] =
    useState<CustomerFormData>(
      initialForm
    );

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const isEditing = Boolean(customer);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (customer) {
      setForm({
        code: customer.code,
        business_name:
          customer.business_name,
        contact_person:
          customer.contact_person ?? "",
        email: customer.email ?? "",
        phone: customer.phone ?? "",
        address: customer.address ?? "",
      });
    } else {
      setForm(initialForm);
    }

    setError("");
  }, [open, customer]);

  if (!open) {
    return null;
  }

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
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
      setError("Customer code wajib diisi.");
      return;
    }

    if (!form.business_name.trim()) {
      setError(
        "Business name wajib diisi."
      );
      return;
    }

    if (
      form.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      setError(
        "Format email customer tidak valid."
      );
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        code: form.code.trim(),
        business_name:
          form.business_name.trim(),
        contact_person:
          form.contact_person.trim() ||
          undefined,
        email:
          form.email.trim() || undefined,
        phone:
          form.phone.trim() || undefined,
        address:
          form.address.trim() || undefined,
      };

      if (customer) {
        await updateCustomer(
          customer.id,
          payload
        );
      } else {
        await createCustomer(payload);
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(
        "Failed to save customer:",
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
              "Data customer tidak valid."
          )
        );
      } else {
        setError(
          error?.response?.data?.message ||
            "Gagal menyimpan customer."
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
        aria-labelledby="customer-form-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2
              id="customer-form-title"
              className="text-lg font-semibold text-slate-900"
            >
              {isEditing
                ? "Edit Customer"
                : "Add Customer"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isEditing
                ? "Perbarui informasi customer."
                : "Tambahkan customer baru."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
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

        {/* Form */}
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
              <div>
                <label
                  htmlFor="customer-code"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Customer Code
                </label>

                <input
                  id="customer-code"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  maxLength={50}
                  placeholder="CUS001"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label
                  htmlFor="customer-business-name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Business Name
                </label>

                <input
                  id="customer-business-name"
                  name="business_name"
                  value={form.business_name}
                  onChange={handleChange}
                  maxLength={255}
                  placeholder="PT Example Indonesia"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label
                  htmlFor="customer-contact-person"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Contact Person
                </label>

                <input
                  id="customer-contact-person"
                  name="contact_person"
                  value={
                    form.contact_person
                  }
                  onChange={handleChange}
                  maxLength={255}
                  placeholder="Nama kontak"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label
                  htmlFor="customer-email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email
                </label>

                <input
                  id="customer-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  maxLength={255}
                  placeholder="customer@example.com"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label
                  htmlFor="customer-phone"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Phone
                </label>

                <input
                  id="customer-phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={30}
                  placeholder="08123456789"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="customer-address"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Address
              </label>

              <textarea
                id="customer-address"
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={4}
                placeholder="Alamat customer..."
                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {submitting
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomerFormModal;