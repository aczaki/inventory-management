interface StockStatusProps {
  quantity: number | string;
  minimumStock: number | string;
}

const StockStatus = ({
  quantity,
  minimumStock,
}: StockStatusProps) => {
  const currentStock = Number(quantity);
  const minimum = Number(minimumStock);

  const isLowStock = currentStock <= minimum;

  if (isLowStock) {
    return (
      <div className="inline-flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-red-500" />

        <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
          Low Stock
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-green-500" />

      <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">
        Healthy
      </span>
    </div>
  );
};

export default StockStatus;