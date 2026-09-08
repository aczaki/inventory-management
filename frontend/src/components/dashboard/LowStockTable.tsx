import type { LowStockProduct } from "../../types/dashboard";

interface LowStockTableProps {
  data: LowStockProduct[];
}

function LowStockTable({
  data,
}: LowStockTableProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
        <h2 className="text-base font-semibold text-slate-900">
          Low Stock Products
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Produk yang membutuhkan perhatian karena stok rendah.
        </p>
      </div>

      {data.length === 0 ? (
        /* Empty State */
        <div className="flex min-h-64 items-center justify-center px-6 py-10">
          <div className="max-w-sm text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-slate-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9 12 2 2 4-4"
                />

                <circle
                  cx="12"
                  cy="12"
                  r="9"
                />
              </svg>
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-800">
              Semua stok dalam kondisi aman
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-400">
              Tidak ada produk yang berada di bawah batas minimum stok.
            </p>
          </div>
        </div>
      ) : (
        /* Table */
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Product
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  SKU
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Stock
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Minimum
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-slate-800">
                      {product.name}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-500">
                    {product.sku}
                  </td>

                  <td className="px-5 py-4 text-right text-sm font-semibold text-red-600">
                    {product.quantity}
                  </td>

                  <td className="px-5 py-4 text-right text-sm text-slate-500">
                    {product.minimum_stock}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
                      Low Stock
                    </span>
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

export default LowStockTable;