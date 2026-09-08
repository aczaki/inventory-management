import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { WarehouseStock } from "../../types/dashboard";

interface WarehouseStockChartProps {
  data: WarehouseStock[];
}

function WarehouseStockChart({
  data,
}: WarehouseStockChartProps) {
  const chartData = data.map((item) => ({
    warehouseName: item.warehouse.name,
    warehouseCode: item.warehouse.code,
    totalStock: Number(item.total_stock),
  }));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">
          Stock by Warehouse
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Distribusi stok pada setiap gudang.
        </p>
      </div>

      {/* Empty State */}
      {chartData.length === 0 ? (
        <div className="flex h-72 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
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
                  d="M3 10 12 3l9 7v10H3V10Z"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 21v-7h10v7"
                />
              </svg>
            </div>

            <p className="mt-3 text-sm font-medium text-slate-600">
              Belum ada data stok gudang
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Data akan muncul setelah inventory tersedia.
            </p>
          </div>
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{
                top: 5,
                right: 20,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
              />

              <XAxis
                type="number"
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: "#64748b",
                }}
              />

              <YAxis
                type="category"
                dataKey="warehouseName"
                width={110}
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: "#475569",
                }}
              />

              <Tooltip
                cursor={{
                  fill: "#f8fafc",
                }}
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  boxShadow:
                    "0 4px 12px rgba(15, 23, 42, 0.08)",
                }}
                labelStyle={{
                  color: "#0f172a",
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
                formatter={(value) => [
                  value,
                  "Total Stock",
                ]}
              />

              <Bar
                dataKey="totalStock"
                radius={[0, 6, 6, 0]}
                barSize={26}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default WarehouseStockChart;