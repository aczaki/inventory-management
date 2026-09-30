# Inventory Management System

A modern full-stack **Inventory Management System** built to manage products, categories, suppliers, customers, warehouses, stock levels, inventory transactions, dashboards, and reports through a Laravel REST API and React-based web application.

This project was built as a portfolio project to demonstrate practical full-stack development, including authentication, CRUD operations, inventory business flows, API integration, data visualization, responsive UI, validation, and production-oriented frontend QA.

> **Project status:** Frontend development and QA completed. The production build passes successfully.
>
> The current frontend has a non-blocking Vite bundle-size warning. This can be optimized in a future iteration with route-level code splitting.

---

## ✨ Features

### Authentication

- Login with email and password
- Laravel Sanctum bearer-token authentication
- Protected routes
- Session verification through `GET /api/me`
- Automatic handling of unauthorized (`401`) responses
- Logout flow
- Authenticated users are redirected away from the login page

### Dashboard

- Total products
- Total stock
- Low-stock summary
- Total warehouses
- Stock movement summary
- Stock by warehouse visualization
- Low-stock product table
- Recent inventory transactions

### Master Data

#### Products

- Create products
- Update products
- Delete products
- Search products
- Product image upload
- SKU and barcode management
- Purchase and selling prices
- Minimum stock configuration

#### Categories

- Create categories
- Update categories
- Delete categories
- Restore deleted categories
- Parent-child category relationships

#### Suppliers

- Create suppliers
- Update suppliers
- Delete suppliers
- Restore deleted suppliers
- Supplier contact information
- Supplier status management
- Product-supplier relationships

#### Customers

- Create customers
- Update customers
- Delete customers
- Customer business and contact information

#### Warehouses

- Create warehouses
- Update warehouses
- Delete warehouses using soft delete
- Restore deleted warehouses
- Warehouse status management
- Warehouse address and description

### Inventory

- Inventory stock list
- Product search
- Warehouse filtering
- Low-stock status indicator
- Stock In
- Stock Out
- Stock Adjustment
- Inventory transaction history
- Transaction detail view
- Transaction filtering and pagination

### Reports

- Inventory report
- Transaction report
- Stock movement report
- Stock by warehouse report
- Date filtering
- Warehouse filtering
- Product filtering
- Customer filtering
- Transaction type filtering
- Reference type filtering
- Reset filters
- Charts and tabular data

### UI/UX

- Clean and minimal SaaS-style interface
- Responsive dashboard layout
- Responsive sidebar and mobile navigation
- Independent sidebar/content scrolling
- Loading skeletons
- Empty states
- Error states
- Confirmation dialogs
- Responsive data tables
- Form validation
- Submit-state handling to prevent duplicate submissions

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI development |
| TypeScript | Type safety |
| Vite 8 | Development and production build tooling |
| Tailwind CSS 4 | Styling |
| Axios | REST API communication |
| React Router | Client-side routing |
| Recharts | Dashboard and report charts |
| React Hook Form | Form handling |
| Zod | Validation |
| Lucide React | UI icons |
| TanStack React Query | Client-side data/query tooling |

### Backend

| Technology | Purpose |
|---|---|
| Laravel 13 | REST API and business logic |
| Laravel Sanctum | Token-based authentication |
| PHP | Backend runtime |
| MySQL | Relational database |

The backend is responsible for authentication, business logic, inventory processing, validation, API resources, and persistence.

### Development Tools

- Git
- GitHub
- Postman
- VS Code

---

## 🏗️ Application Architecture

The application uses a separated frontend and backend architecture.

```text
┌──────────────────────────────┐
│          Frontend            │
│                              │
│ React + TypeScript            │
│ Tailwind CSS                 │
│ Recharts                     │
│ React Query                  │
└──────────────┬───────────────┘
               │
               │ REST API / JSON
               ▼
┌──────────────────────────────┐
│           Backend            │
│                              │
│ Laravel 13                   │
│ Laravel Sanctum              │
│ Business Logic               │
│ API Controllers              │
│ API Resources                │
└──────────────┬───────────────┘
               │
               │ Eloquent ORM
               ▼
┌──────────────────────────────┐
│            MySQL             │
│                              │
│ Products                     │
│ Categories                   │
│ Suppliers                    │
│ Customers                    │
│ Warehouses                   │
│ Inventory Stocks             │
│ Inventory Transactions       │
└──────────────────────────────┘
```

### Frontend Structure

The frontend follows a feature-oriented React structure:

```text
src/
├── assets/
├── components/
│   ├── categories/
│   ├── customers/
│   ├── dashboard/
│   ├── inventory/
│   ├── layout/
│   ├── products/
│   ├── suppliers/
│   └── warehouses/
│
├── layouts/
│   └── DashboardLayout.tsx
│
├── pages/
│   ├── Categories/
│   ├── Customers/
│   ├── Inventory/
│   ├── Reports/
│   ├── Suppliers/
│   ├── Warehouses/
│   ├── products/
│   ├── Dashboard.tsx
│   └── Login.tsx
│
├── services/
│   ├── api.ts
│   ├── authService.ts
│   ├── categoryService.ts
│   ├── customerService.ts
│   ├── dashboardService.ts
│   ├── inventoryStockService.ts
│   ├── inventoryTransactionService.ts
│   ├── productService.ts
│   ├── reportService.ts
│   ├── supplierService.ts
│   └── warehouseService.ts
│
├── types/
│   ├── auth.ts
│   ├── category.ts
│   ├── customer.ts
│   ├── dashboard.ts
│   ├── inventoryStock.ts
│   ├── inventoryTransaction.ts
│   ├── product.ts
│   ├── report.ts
│   ├── supplier.ts
│   └── warehouse.ts
│
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

The application separates:

- **Pages** — page-level UI and business flows
- **Components** — reusable UI and feature components
- **Services** — API communication
- **Types** — TypeScript domain models
- **Layouts** — shared application layout

---

## 📦 Main Modules

```text
Inventory Management System
│
├── Authentication
│
├── Dashboard
│
├── Master Data
│   ├── Products
│   ├── Categories
│   ├── Suppliers
│   ├── Customers
│   └── Warehouses
│
├── Inventory
│   ├── Stock List
│   ├── Stock In
│   ├── Stock Out
│   ├── Adjustment
│   └── Transactions
│
└── Reports
    ├── Inventory Report
    ├── Transaction Report
    ├── Stock Movement
    └── Stock by Warehouse
```

---

## 🔐 Authentication Flow

Authentication is handled through the Laravel API using Sanctum bearer tokens.

```text
Login
  │
  ▼
POST /api/login
  │
  ▼
Receive access token
  │
  ▼
Store token in localStorage
  │
  ▼
ProtectedRoute
  │
  ▼
GET /api/me
  │
  ├── Valid → Application
  │
  └── 401 → Clear token → /login
```

Axios automatically attaches the token to authenticated API requests:

```http
Authorization: Bearer <token>
```

The frontend also handles expired or invalid authentication sessions by clearing the stored token and redirecting the user to the login page.

---

## 📦 Inventory Flow

The main inventory workflow is represented by three transaction types:

```text
                  ┌──────────────┐
                  │    Product   │
                  └──────┬───────┘
                         │
                         ▼
                ┌──────────────────┐
                │ Warehouse Stock  │
                └───────┬──────────┘
                        │
           ┌────────────┼────────────┐
           ▼            ▼            ▼
       Stock In     Stock Out    Adjustment
           │            │            │
           └────────────┼────────────┘
                        ▼
               Transaction History
```

### Stock In

Adds inventory to a selected warehouse and records the operation as an inventory transaction.

### Stock Out

Removes inventory from a selected warehouse and can associate the transaction with a customer.

### Adjustment

Sets the actual stock quantity based on physical stock verification. The UI also displays the difference between system stock and the entered actual quantity.

---

## 📊 Dashboard & Reporting

The dashboard provides an overview of the inventory system through:

- Inventory summary cards
- Stock movement visualization
- Warehouse stock visualization
- Low-stock monitoring
- Recent transaction history

The Reports page provides:

1. **Inventory Report**
2. **Transaction Report**
3. **Stock Movement**
4. **Stock by Warehouse**

The Stock Movement report represents the **number of inventory transactions**, not the quantity of stock moved.

---

## 🔌 API Overview

The backend exposes RESTful API endpoints.

### Authentication

```text
POST /api/login
GET  /api/me
POST /api/logout
```

### Dashboard

```text
GET /api/dashboard
```

### Products

```text
GET    /api/products
POST   /api/products
GET    /api/products/{id}
PUT    /api/products/{id}
DELETE /api/products/{id}
POST   /api/products/{id}/restore
```

### Categories

```text
GET    /api/categories
POST   /api/categories
GET    /api/categories/{id}
PUT    /api/categories/{id}
DELETE /api/categories/{id}
POST   /api/categories/{id}/restore
```

### Suppliers

```text
GET    /api/suppliers
POST   /api/suppliers
GET    /api/suppliers/{id}
PUT    /api/suppliers/{id}
DELETE /api/suppliers/{id}
POST   /api/suppliers/{id}/restore
```

### Customers

```text
GET    /api/customers
POST   /api/customers
GET    /api/customers/{id}
PUT    /api/customers/{id}
DELETE /api/customers/{id}
```

### Warehouses

```text
GET    /api/warehouses
POST   /api/warehouses
GET    /api/warehouses/{id}
PUT    /api/warehouses/{id}
DELETE /api/warehouses/{id}
POST   /api/warehouses/{id}/restore
```

### Inventory

```text
GET  /api/inventory/stocks/{product}/{warehouse}

POST /api/inventory/stocks/in
POST /api/inventory/stocks/out
POST /api/inventory/stocks/adjustment
```

### Inventory Transactions

```text
GET /api/inventory/transactions
GET /api/inventory/transactions/{id}
```

### Reports

```text
GET /api/reports/inventory
GET /api/reports/transactions
GET /api/reports/stock-movement
GET /api/reports/stock-by-warehouse
```

All protected endpoints require a valid Sanctum bearer token.

---

## 🚀 Getting Started

The project consists of two applications:

```text
inventory-management/
├── backend/
└── frontend/
```

Both applications need to be configured and run separately.

### Prerequisites

Make sure the following are installed:

- PHP 8.2+
- Composer
- Node.js
- npm
- MySQL
- Git

---

# Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
composer install
```

Create the environment file:

```bash
cp .env.example .env
```

For Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Generate the application key:

```bash
php artisan key:generate
```

### Database Configuration

Create a MySQL database:

```text
inventory_management
```

Configure `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=inventory_management
DB_USERNAME=root
DB_PASSWORD=
```

Adjust the username and password according to your local MySQL configuration.

Run migrations:

```bash
php artisan migrate
```

If seeders are available:

```bash
php artisan db:seed
```

Create the storage link:

```bash
php artisan storage:link
```

Start the Laravel development server:

```bash
php artisan serve
```

Backend:

```text
http://localhost:8000
```

---

# Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:8000/api
```

Start the development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## ⚙️ Environment Variables

### Frontend

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL of the Laravel API | `http://localhost:8000/api` |

For production, replace the local API URL with the deployed backend API URL.

> Do not commit `.env` to the repository.

---

## 🧪 API Testing

The backend API was tested using Postman.

Authentication flow:

```text
1. POST /api/login
2. Copy the returned token
3. Add Bearer Token to protected requests
4. Test protected endpoints
```

Example:

```http
Authorization: Bearer YOUR_TOKEN
Accept: application/json
```

### Example Login Request

```http
POST /api/login
Content-Type: application/json
Accept: application/json
```

Request body:

```json
{
    "email": "user@example.com",
    "password": "password"
}
```

---

## 🧪 Testing & QA

The frontend has gone through a comprehensive QA process covering:

- Authentication
- Protected routes
- Routing
- CRUD flows
- Inventory transactions
- Reports
- Loading states
- Empty states
- Error handling
- Runtime console checks
- Responsive layouts
- Production build

The final smoke test covered:

```text
Authentication      PASS
Routing             PASS
CRUD                PASS
Inventory           PASS
Reports             PASS
Runtime Console     PASS
Responsive          PASS
Production Build    PASS
```

### Production Build

The current production build completes successfully:

```text
tsc -b
✓

vite build
✓
```

There is currently a Vite warning for a JavaScript chunk larger than 500 KB. This is a performance optimization opportunity rather than a build failure.

---

## 📸 Screenshots

Recommended screenshots for the GitHub repository:

```text
docs/screenshots/
├── dashboard.png
├── products.png
├── inventory-stock.png
├── transactions.png
└── reports.png
```

Example Markdown usage:

```markdown
![Dashboard](docs/screenshots/dashboard.png)
```

A polished GitHub repository should ideally include 3–5 screenshots showing the most important parts of the application.

---

## 🗺️ Current Frontend Routes

| Route | Page |
|---|---|
| `/login` | Login |
| `/dashboard` | Dashboard |
| `/products` | Product Management |
| `/categories` | Category Management |
| `/suppliers` | Supplier Management |
| `/customers` | Customer Management |
| `/warehouses` | Warehouse Management |
| `/inventory/stock` | Inventory Stock |
| `/inventory/stock-in` | Stock In |
| `/inventory/stock-out` | Stock Out |
| `/inventory/adjustment` | Stock Adjustment |
| `/inventory/transactions` | Transaction History |
| `/reports` | Reports |

---

## 🎯 Development Highlights

This project was built to demonstrate practical full-stack development skills rather than a static landing page.

Key implementation areas include:

- REST API integration
- Token-based authentication
- CRUD operations
- Laravel Eloquent relationships
- API Resources
- Form validation
- File upload handling
- Soft delete and restore flows
- Inventory business logic
- Warehouse stock management
- Stock In / Stock Out / Adjustment workflows
- Transaction history
- Filtering and pagination
- Dashboard development
- Data visualization with Recharts
- Responsive SaaS-style UI
- Loading, empty, and error state management
- Type-safe frontend development
- Production build and QA

---

## 🧠 Technical Decisions

### Separate Frontend and Backend

The frontend and backend are developed as separate applications.

This creates a clear separation between:

- Presentation layer
- API layer
- Business logic
- Database layer

The backend API can also be reused by other clients in the future.

### RESTful API

The backend exposes RESTful endpoints for the main resources, making the system easier to integrate with web, mobile, or external applications.

### Token-Based Authentication

Laravel Sanctum provides authentication for protected API endpoints using bearer tokens.

### Soft Delete

Master data such as products, categories, suppliers, and warehouses use soft deletion where appropriate. This helps prevent accidental permanent data loss and allows deleted records to be restored.

### Inventory Transactions

Stock changes are recorded through inventory transactions rather than only storing the latest stock quantity. This provides a historical record of inventory operations.

---

## 🔮 Future Improvements

The current application is functional and production-build ready. Potential improvements for future iterations include:

- Route-level code splitting with `React.lazy`
- Shared `useDebounce` hook for list search fields
- More advanced caching and server-state optimization
- Automated frontend testing
- Automated backend testing
- Role and permission management
- Audit logs and activity history
- Additional reporting and export capabilities
- Excel export
- PDF export
- Automated inventory alerts
- API documentation with OpenAPI / Swagger
- Docker-based development environment
- Production deployment
- CI/CD pipeline

These are considered future improvements and are not required for the current application flow.

---

## 📌 Project Highlights

This project was built as a portfolio project to demonstrate practical full-stack application development.

The project covers a complete inventory workflow:

```text
Authentication
      ↓
Master Data
      ↓
Inventory Management
      ↓
Inventory Transactions
      ↓
Dashboard
      ↓
Reports
```

The implementation focuses on building a realistic business application with reusable components, structured API integration, validation, responsive UI, and clear separation between frontend and backend responsibilities.

---

## 👨‍💻 Author

**Achmad Zaki**

Web Developer / Full-Stack Developer

Portfolio:  
https://achmadzaki.vercel.app

---

## 📄 License

This project is created as a personal portfolio project.
