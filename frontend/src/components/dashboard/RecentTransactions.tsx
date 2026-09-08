import type { RecentTransaction } from "../../types/dashboard";

interface RecentTransactionsProps {
  data: RecentTransaction[];
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const getTransactionLabel = (
  type: RecentTransaction["type"]
) => {
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

const getTransactionStyle = (
  type: RecentTransaction["type"]
) => {
  switch (type) {
    case "in":
      return "bg-emerald-50 text-emerald-600";

    case "out":
      return "bg-red-50 text-red-600";

    case "adjustment":
      return "bg-amber-50 text-amber-600";

    default:
      return "bg-slate-100 text-slate-600";
  }
};

function RecentTransactions({
  data,
}: RecentTransactionsProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
        <h2 className="text-base font-semibold text-slate-900">
          Recent Transactions
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Aktivitas inventory terbaru.
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex min-h-64 items-center justify-center px-6 py-10">
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
                <rect
                  x="5"
                  y="3"
                  width="14"
                  height="18"
                  rx="2"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 8h8M8 12h8M8 16h5"
                />
              </svg>
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-800">
              Belum ada transaksi
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Aktivitas inventory akan muncul di sini.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Transaction
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Type
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Reference
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Warehouse
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  {/* Transaction number */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-slate-800">
                      {transaction.transaction_number}
                    </p>

                    {transaction.notes && (
                      <p className="mt-1 max-w-[240px] truncate text-xs text-slate-400">
                        {transaction.notes}
                      </p>
                    )}
                  </td>

                  {/* Type */}
                  <td className="px-5 py-4">
                    <span
                      className={[
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                        getTransactionStyle(
                          transaction.type
                        ),
                      ].join(" ")}
                    >
                      {getTransactionLabel(
                        transaction.type
                      )}
                    </span>
                  </td>

                  {/* Reference */}
                  <td className="px-5 py-4">
                    <p className="text-sm text-slate-700">
                      {transaction.reference_number ||
                        "-"}
                    </p>

                    <p className="mt-1 text-xs capitalize text-slate-400">
                      {transaction.reference_type ||
                        "-"}
                    </p>
                  </td>

                  {/* Warehouse */}
                  <td className="px-5 py-4">
                    <p className="text-sm text-slate-700">
                      {transaction.warehouse?.name ||
                        "-"}
                    </p>

                    {transaction.warehouse?.code && (
                      <p className="mt-1 text-xs text-slate-400">
                        {transaction.warehouse.code}
                      </p>
                    )}
                  </td>

                  {/* Date */}
                  <td className="whitespace-nowrap px-5 py-4 text-right text-sm text-slate-500">
                    {formatDate(
                      transaction.transaction_date
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RecentTransactions;