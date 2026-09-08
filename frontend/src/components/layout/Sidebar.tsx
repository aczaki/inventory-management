import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavigationItem {
  label: string;
  path: string;
  end?: boolean;
  icon: React.ReactNode;
}

function DashboardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ProductIcon() {
  return (
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
        d="M3 7.5 12 3l9 4.5M3 7.5 12 12m0 0 9-4.5M12 12v9M3 7.5V16l9 5 9-5V7.5"
      />
    </svg>
  );
}

function CategoryIcon() {
  return (
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
        d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4 7.5 8 4.5 8-4.5M12 12v9"
      />
    </svg>
  );
}

function SupplierIcon() {
  return (
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
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      />
      <circle cx="9" cy="7" r="4" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
      />
    </svg>
  );
}

function CustomerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="8" r="4" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 21a8 8 0 0 1 16 0"
      />
    </svg>
  );
}

function WarehouseIcon() {
  return (
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
        d="M3 10 12 3l9 7v10H3V10Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 21v-7h10v7M9 10h6"
      />
    </svg>
  );
}

function StockIcon() {
  return (
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
        d="M4 19V5m0 14 4-4 4 3 8-9"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 9h4v4"
      />
    </svg>
  );
}

function StockInIcon() {
  return (
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
        d="M12 3v12"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m7 10 5 5 5-5"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 21h14"
      />
    </svg>
  );
}

function StockOutIcon() {
  return (
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
        d="M12 15V3"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m17 8-5-5-5 5"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 21h14"
      />
    </svg>
  );
}

function AdjustmentIcon() {
  return (
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
        d="M4 6h16M4 12h16M4 18h16"
      />
      <circle cx="8" cy="6" r="1.5" fill="currentColor" />
      <circle cx="15" cy="12" r="1.5" fill="currentColor" />
      <circle cx="10" cy="18" r="1.5" fill="currentColor" />
    </svg>
  );
}

function TransactionIcon() {
  return (
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
        d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 8h8M8 12h8M8 16h5"
      />
    </svg>
  );
}

function ReportIcon() {
  return (
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
        d="M4 19V5M4 19h16"
      />
      <rect x="7" y="12" width="2.5" height="5" rx="0.5" />
      <rect x="11" y="9" width="2.5" height="8" rx="0.5" />
      <rect x="15" y="6" width="2.5" height="11" rx="0.5" />
    </svg>
  );
}

const mainNavigation: NavigationItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    end: true,
    icon: <DashboardIcon />,
  },
];

const masterDataNavigation: NavigationItem[] = [
  {
    label: "Products",
    path: "/products",
    icon: <ProductIcon />,
  },
  {
    label: "Categories",
    path: "/categories",
    icon: <CategoryIcon />,
  },
  {
    label: "Suppliers",
    path: "/suppliers",
    icon: <SupplierIcon />,
  },
  {
    label: "Customers",
    path: "/customers",
    icon: <CustomerIcon />,
  },
  {
    label: "Warehouses",
    path: "/warehouses",
    icon: <WarehouseIcon />,
  },
];

const inventoryNavigation: NavigationItem[] = [
  {
    label: "Stock",
    path: "/inventory/stock",
    icon: <StockIcon />,
  },
  {
    label: "Stock In",
    path: "/inventory/stock-in",
    icon: <StockInIcon />,
  },
  {
    label: "Stock Out",
    path: "/inventory/stock-out",
    icon: <StockOutIcon />,
  },
  {
    label: "Adjustment",
    path: "/inventory/adjustment",
    icon: <AdjustmentIcon />,
  },
  {
    label: "Transactions",
    path: "/inventory/transactions",
    icon: <TransactionIcon />,
  },
];

const reportNavigation: NavigationItem[] = [
  {
    label: "Reports",
    path: "/reports",
    end: true,
    icon: <ReportIcon />,
  },
];

function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {
  const renderNavigation = (items: NavigationItem[]) => {
    return items.map((item) => (
      <NavLink
        key={item.path}
        to={item.path}
        end={item.end}
        onClick={onClose}
        className={({ isActive }) =>
          [
            "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
            isActive
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
          ].join(" ")
        }
      >
        {({ isActive }) => (
          <>
            <span
              className={
                isActive
                  ? "text-white"
                  : "text-slate-400 group-hover:text-slate-700"
              }
            >
              {item.icon}
            </span>

            <span>{item.label}</span>
          </>
        )}
      </NavLink>
    ));
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900">
              Inventory
            </h1>

            <p className="text-xs text-slate-400">
              Management System
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6l12 12M18 6 6 18"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <div>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Main
            </p>

            <div className="space-y-1">
              {renderNavigation(mainNavigation)}
            </div>
          </div>

          <div className="mt-7">
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Master Data
            </p>

            <div className="space-y-1">
              {renderNavigation(masterDataNavigation)}
            </div>
          </div>

          <div className="mt-7">
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Inventory
            </p>

            <div className="space-y-1">
              {renderNavigation(inventoryNavigation)}
            </div>
          </div>

          <div className="mt-7">
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Reports
            </p>

            <div className="space-y-1">
              {renderNavigation(reportNavigation)}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4">
          <p className="text-xs font-medium text-slate-500">
            Inventory Management
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Version 1.0.0
          </p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
