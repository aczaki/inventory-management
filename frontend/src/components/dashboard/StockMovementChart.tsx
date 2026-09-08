import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface StockMovementChartProps {
  stockIn: number;
  stockOut: number;
}

function StockMovementChart({
  stockIn,
  stockOut,
}: StockMovementChartProps) {
  const data = [
    {
      name: "Stock In",
      value: stockIn,
    },
    {
      name: "Stock Out",
      value: stockOut,
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">
          Stock Movement
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Perbandingan stok masuk dan stok keluar.
        </p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: "#64748b",
              }}
            />

            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: "#64748b",
              }}
            />

            <Tooltip
              cursor={{ fill: "#f8fafc" }}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
              }}
              labelStyle={{
                color: "#0f172a",
                fontWeight: 600,
              }}
              formatter={(value) => [
                value,
                "Quantity",
              ]}
            />

            <Bar
              dataKey="value"
              radius={[6, 6, 0, 0]}
              barSize={64}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default StockMovementChart;