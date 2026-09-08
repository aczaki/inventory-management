import { useEffect, useRef, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  clearAuth,
  getMe,
  logout,
} from "../../services/authService";

interface HeaderProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/products": "Products",
  "/categories": "Categories",
  "/suppliers": "Suppliers",
  "/customers": "Customers",
  "/warehouses": "Warehouses",
  "/inventory/stock": "Stock",
  "/inventory/stock-in": "Stock In",
  "/inventory/stock-out": "Stock Out",
  "/inventory/adjustment": "Adjustment",
  "/inventory/transactions": "Transactions",
  "/reports": "Reports",
};

function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const pageTitle =
    pageTitles[location.pathname] ?? "Inventory Management";

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getMe();

        setUserName(response.data.user.name);
        setUserEmail(response.data.user.email);
      } catch (error) {
        console.error("Failed to load user:", error);

        clearAuth();
        navigate("/login", { replace: true });
      }
    };

    loadUser();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      clearAuth();
    } finally {
      navigate("/login", { replace: true });
      setLoggingOut(false);
    }
  };

  const initial =
    userName.charAt(0).toUpperCase();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      {/* Left */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">
            {pageTitle}
          </p>

          <p className="hidden text-xs text-slate-400 sm:block">
            Inventory Management System
          </p>
        </div>
      </div>

      {/* Right */}
      <div
        ref={dropdownRef}
        className="relative flex items-center"
      >
        <button
          type="button"
          onClick={() =>
            setDropdownOpen((previous) => !previous)
          }
          aria-expanded={dropdownOpen}
          className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition hover:bg-slate-50"
        >
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-800">
              {userName}
            </p>

            <p className="text-xs text-slate-400">
              {userEmail}
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            {initial}
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={[
              "hidden h-4 w-4 text-slate-400 transition-transform sm:block",
              dropdownOpen ? "rotate-180" : "",
            ].join(" ")}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m6 9 6 6 6-6"
            />
          </svg>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-12 z-30 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            {/* User info */}
            <div className="border-b border-slate-100 px-4 py-4">
              <p className="text-sm font-semibold text-slate-900">
                {userName}
              </p>

              <p className="mt-1 truncate text-xs text-slate-400">
                {userEmail}
              </p>
            </div>

            {/* Actions */}
            <div className="p-2">
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
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
                    d="M10 17l5-5-5-5"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12H3"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 19V5a2 2 0 0 0-2-2h-6"
                  />
                </svg>

                {loggingOut
                  ? "Logging out..."
                  : "Logout"}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
