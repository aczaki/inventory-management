interface StockStatusProps {
  quantity: number | string;
  minimumStock: number | string;
}

function StockStatus({
  quantity,
  minimumStock,
}: StockStatusProps) {
  const stock = Number(quantity);
  const minimum = Number(minimumStock);

  if (stock <= minimum) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        Low Stock
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      Healthy
    </span>
  );
}

export default StockStatus;