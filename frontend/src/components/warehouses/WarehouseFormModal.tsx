import { FormEvent, useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";

import {
  createWarehouse,
  updateWarehouse,
} from "../../services/warehouseService";

import type {
  Warehouse,
  WarehouseFormData,
} from "../../types/warehouse";

interface WarehouseFormModalProps {
  isOpen: boolean;
  warehouse: Warehouse | null;
  onClose: () => void;
  onSuccess: (warehouse: Warehouse) => void;
}

const initialFormData: WarehouseFormData = {
  code: "",
  name: "",
  address: "",
  description: "",
  status: "active",
};

const WarehouseFormModal = ({
  isOpen,
  warehouse,
  onClose,
  onSuccess,
}: WarehouseFormModalProps) => {
  const [formData, setFormData] =
    useState<WarehouseFormData>(initialFormData);

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isEdit = Boolean(warehouse);

  useEffect(() => {
    if (!isOpen) return;

    setErrors({});
    setGeneralError("");

    if (warehouse) {
      setFormData({
        code: warehouse.code,
        name: warehouse.name,
        address: warehouse.address ?? "",
        description: warehouse.description ?? "",
        status: warehouse.status,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [isOpen, warehouse]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (
    field: keyof WarehouseFormData,
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((current) => {
        const updated = { ...current };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setErrors({});
      setGeneralError("");

      let result: Warehouse;

      if (isEdit && warehouse) {
        result = await updateWarehouse(warehouse.id, formData);
      } else {
        result = await createWarehouse(formData);
      }

      onSuccess(result);
    } catch (err: any) {
      console.error("Failed to save warehouse:", err);

      const responseData = err?.response?.data;

      if (responseData?.errors) {
        setErrors(responseData.errors);
      }

      setGeneralError(
        responseData?.message ||
          `Failed to ${isEdit ? "update" : "create"} warehouse.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEdit ? "Edit Warehouse" : "Add Warehouse"}
            </h2>

            <p className="mt-0.5 text-sm text-gray-500">
              {isEdit
                ? "Update warehouse information."
                : "Add a new warehouse to your inventory."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto"
        >
          <div className="space-y-5 px-6 py-6">
            {/* General Error */}
            {generalError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-700">
                  {generalError}
                </p>
              </div>
            )}

            {/* Code + Name */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Code */}
              <div>
                <label
                  htmlFor="warehouse-code"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Warehouse Code
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  id="warehouse-code"
                  type="text"
                  value={formData.code}
                  onChange={(event) =>
                    handleChange(
                      "code",
                      event.target.value.toUpperCase()
                    )
                  }
                  placeholder="WH001"
                  maxLength={20}
                  disabled={submitting}
                  className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                    errors.code
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:border-gray-500 focus:ring-gray-100"
                  }`}
                />

                {errors.code && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.code[0]}
                  </p>
                )}
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="warehouse-name"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Warehouse Name
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  id="warehouse-name"
                  type="text"
                  value={formData.name}
                  onChange={(event) =>
                    handleChange("name", event.target.value)
                  }
                  placeholder="Gudang Utama"
                  maxLength={255}
                  disabled={submitting}
                  className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                    errors.name
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:border-gray-500 focus:ring-gray-100"
                  }`}
                />

                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.name[0]}
                  </p>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="warehouse-address"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Address
              </label>

              <textarea
                id="warehouse-address"
                value={formData.address}
                onChange={(event) =>
                  handleChange("address", event.target.value)
                }
                placeholder="Jl. Contoh No. 123"
                rows={3}
                disabled={submitting}
                className={`w-full resize-none rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                  errors.address
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-gray-500 focus:ring-gray-100"
                }`}
              />

              {errors.address && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.address[0]}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="warehouse-description"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Description
              </label>

              <textarea
                id="warehouse-description"
                value={formData.description}
                onChange={(event) =>
                  handleChange(
                    "description",
                    event.target.value
                  )
                }
                placeholder="Describe the warehouse..."
                rows={4}
                disabled={submitting}
                className={`w-full resize-none rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                  errors.description
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-gray-500 focus:ring-gray-100"
                }`}
              />

              {errors.description && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.description[0]}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="warehouse-status"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Status
                <span className="ml-1 text-red-500">*</span>
              </label>

              <select
                id="warehouse-status"
                value={formData.status}
                onChange={(event) =>
                  handleChange(
                    "status",
                    event.target.value as "active" | "inactive"
                  )
                }
                disabled={submitting}
                className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                  errors.status
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-gray-500 focus:ring-gray-100"
                }`}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              {errors.status && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.status[0]}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50/50 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {submitting
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                  ? "Update Warehouse"
                  : "Create Warehouse"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WarehouseFormModal;