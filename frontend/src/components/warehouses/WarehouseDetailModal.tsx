import { useEffect, useState } from "react";
import {
  Building2,
  CalendarDays,
  Clock3,
  Loader2,
  MapPin,
  X,
} from "lucide-react";

import { getWarehouse } from "../../services/warehouseService";
import type { Warehouse } from "../../types/warehouse";

interface WarehouseDetailModalProps {
  isOpen: boolean;
  warehouse: Warehouse | null;
  onClose: () => void;
}

const WarehouseDetailModal = ({
  isOpen,
  warehouse,
  onClose,
}: WarehouseDetailModalProps) => {
  const [detail, setDetail] = useState<Warehouse | null>(warehouse);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !warehouse) {
      return;
    }

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getWarehouse(warehouse.id);

        setDetail(data);
      } catch (err: any) {
        console.error("Failed to fetch warehouse detail:", err);

        setError(
          err?.response?.data?.message ||
            "Failed to load warehouse details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [isOpen, warehouse]);

  if (!isOpen || !warehouse) {
    return null;
  }

  const formatDate = (date: string) => {
    if (!date) return "-";

    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
              <Building2 className="h-5 w-5 text-gray-600" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Warehouse Details
              </h2>

              <p className="mt-0.5 text-sm text-gray-500">
                View warehouse information.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-7 w-7 animate-spin text-gray-500" />

              <p className="mt-3 text-sm text-gray-500">
                Loading warehouse details...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          ) : detail ? (
            <div className="space-y-5">
              {/* Main Info */}
              <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Warehouse
                    </p>

                    <h3 className="mt-1 text-xl font-semibold text-gray-900">
                      {detail.name}
                    </h3>

                    <p className="mt-1 font-mono text-xs text-gray-500">
                      {detail.code}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                      detail.status === "active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        detail.status === "active"
                          ? "bg-emerald-500"
                          : "bg-gray-400"
                      }`}
                    />

                    {detail.status === "active"
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Address */}
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />

                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Address
                  </p>
                </div>

                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">
                  {detail.address || "No address provided."}
                </p>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Description
                </p>

                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">
                  {detail.description ||
                    "No description provided."}
                </p>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 gap-4 border-t border-gray-200 pt-5 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-4 w-4 text-gray-400" />

                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Created
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      {formatDate(detail.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock3 className="mt-0.5 h-4 w-4 text-gray-400" />

                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Last Updated
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      {formatDate(detail.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-200 bg-gray-50/50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarehouseDetailModal;