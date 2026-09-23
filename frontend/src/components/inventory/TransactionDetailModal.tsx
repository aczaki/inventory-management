import type { InventoryTransaction } from "../../types/inventoryTransaction";

interface TransactionDetailModalProps {
  transaction: InventoryTransaction | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;}

const TransactionDetailModal = ({
  transaction,
  loading,
  error,
  onClose,
}: TransactionDetailModalProps) => {
  if (!transaction && !loading) {
    return null;
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "in":
        return "Stock In";
      case "out":
        return "Stock Out";
      case "adjustment":
        return "Adjustment";
      default:
        return type;
    }
  };

  const getTypeClass = (type: string) => {
    switch (type) {
      case "in":
        return "bg-green-50 text-green-700";
      case "out":
        return "bg-red-50 text-red-700";
      case "adjustment":
        return "bg-blue-50 text-blue-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getReferenceLabel = (referenceType: string | null) => {
    switch (referenceType) {
      case "purchase":
        return "Purchase";
      case "sales":
        return "Sales";
      case "adjustment":
        return "Adjustment";
      default:
        return referenceType || "-";
    }
  };

  const formatDate = (date: string | null | undefined) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Transaction Detail
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Detail informasi transaksi inventory
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
          {loading ? (
          <div className="space-y-6">
            <div className="animate-pulse">
              <div className="h-5 w-40 rounded bg-gray-200" />
              <div className="mt-3 h-4 w-64 rounded bg-gray-200" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-xl border border-gray-100 p-4"
                >
                  <div className="h-3 w-24 rounded bg-gray-200" />
                  <div className="mt-2 h-5 w-36 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
          ) : error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
          ) : transaction ? (
            <div className="space-y-6">
              {/* Transaction Number */}
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Transaction Number
                </p>

                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {transaction.transaction_number}
                </p>
              </div>

              {/* Main Information */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-900">
                  Transaction Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-gray-100 p-4">
                    <p className="text-xs text-gray-500">Type</p>

                    <div className="mt-2">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getTypeClass(
                          transaction.type
                        )}`}
                      >
                        {getTypeLabel(transaction.type)}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-100 p-4">
                    <p className="text-xs text-gray-500">
                      Transaction Date
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {formatDate(transaction.transaction_date)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 p-4">
                    <p className="text-xs text-gray-500">Warehouse</p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {transaction.warehouse
                        ? `${transaction.warehouse.code} - ${transaction.warehouse.name}`
                        : "-"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 p-4">
                    <p className="text-xs text-gray-500">Customer</p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {transaction.customer?.name || "-"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 p-4">
                    <p className="text-xs text-gray-500">Reference Type</p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {getReferenceLabel(transaction.reference_type)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 p-4">
                    <p className="text-xs text-gray-500">
                      Reference Number
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {transaction.reference_number || "-"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 p-4 sm:col-span-2">
                    <p className="text-xs text-gray-500">Created By</p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {transaction.user?.name || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-900">
                  Notes
                </h3>

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
                    {transaction.notes || "Tidak ada catatan."}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-900">
                  Metadata
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-gray-500">
                      Created At
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      {formatDate(transaction.created_at)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Updated At
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      {formatDate(transaction.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;