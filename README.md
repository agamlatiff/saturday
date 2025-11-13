Exploring the codebase to understand the project:


[5 tools called]


Exploring the codebase structure to understand the project's functionality:


[6 tools called]


## **Saturday - Warehouse & Merchant Management System**

### **Overview**
Saturday is a full-stack web application for managing warehouses, merchants, products, and transactions. It supports two roles: Managers (admin) and Keepers (merchant staff).

---

## **Tech Stack**

### **Frontend**
- React 19 with TypeScript
- Vite
- Tailwind CSS 4
- React Router DOM
- React Query (@tanstack/react-query)
- React Hook Form + Zod
- Axios

### **Backend**
- Laravel 12 (PHP 8.2+)
- Laravel Sanctum
- Spatie Laravel Permission
- MySQL/PostgreSQL

---

## **Core Features**

### **1. User Management & Authentication**
- Registration & login
- Role-based access control (Manager, Keeper)
- User profile management
- Settings (CRUD profile, logout, account deletion)

### **2. Product Management** (Manager)
- CRUD products
- Product categories with photos
- Product details (name, price, thumbnail, description, category)

### **3. Warehouse Management** (Manager)
- CRUD warehouses
- Assign products to warehouses with stock tracking
- Stock management per warehouse

### **4. Merchant Management** (Manager)
- CRUD merchants
- Assign keepers to merchants
- Merchant profiles with photos and contact info

### **5. Merchant Product Assignment** (Manager)
- Assign products from warehouses to merchants
- Stock tracking per merchant
- Stock updates

### **6. Transaction Management**
- Manager: view all transactions
- Keeper: create transactions for their merchant
- Multi-step transaction process:
  - Step 1: Select merchant
  - Step 2: Add products to cart with quantity
  - Step 3: Customer info & payment (subtotal, tax 12%, grand total)
- Transaction details view
- Transaction history

### **7. Dashboard & Overview**
- Manager Dashboard: revenue, transactions, products sold
- Merchant Overview: merchant-specific stats and recent transactions

### **8. Responsive Design**
- Mobile-first responsive layout
- Works on desktop, tablet, and mobile
- Tailwind CSS responsive breakpoints

---

## **User Roles**

### **Manager**
- Full access to all features
- Manage users, roles, categories, products, warehouses, merchants
- View all transactions
- Assign products to warehouses and merchants
- Dashboard with system-wide statistics

### **Keeper**
- Limited access
- View assigned merchant profile
- Create transactions for their merchant
- View merchant-specific transactions
- Merchant overview dashboard

---

## **Key Business Logic**

1. Warehouse → Products: Products stored in warehouses with stock
2. Warehouse → Merchant: Products assigned from warehouses to merchants
3. Merchant → Transactions: Keepers create transactions for their merchant
4. Stock Management: Stock tracked at warehouse and merchant levels
5. Transaction Processing: Multi-step flow with tax calculation (12% PPN)

---

## **Project Structure**

```
saturday/
├── saturdayfrontend/     # React + TypeScript frontend
│   ├── src/
│   │   ├── pages/        # All page components
│   │   ├── components/   # Reusable components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── api/          # API configuration
│   │   ├── context/      # React Context providers
│   │   └── routes/       # Route protection
│   └── public/           # Static assets
│
└── saturdaybackend/      # Laravel backend
    ├── app/
    │   ├── Http/
    │   │   ├── Controllers/  # API controllers
    │   │   ├── Requests/     # Form validation
    │   │   └── Resources/    # API resources
    │   ├── Models/          # Eloquent models
    │   ├── Services/        # Business logic
    │   └── Repositories/    # Data access layer
    ├── routes/
    │   └── api.php          # API routes
    └── database/
        └── migrations/      # Database migrations
```

---

## **Key Features Implemented**

- Role-based authentication & authorization
- CRUD operations for all entities
- Stock management (warehouse & merchant level)
- Transaction processing with tax calculation
- Responsive design for all devices
- Search functionality
- Image upload (products, categories, merchants)
- Real-time stock validation
- Multi-step forms with progress tracking
- Modal dialogs for confirmations
- Form validation with Zod schemas

---

## **Use Cases**

1. Warehouse Manager: Manage inventory, assign products to merchants, monitor transactions
2. Merchant Keeper: Process customer transactions, check merchant stock, view sales history
3. System Admin: Manage users, roles, and system-wide settings

---

## **Current Status**

- Fully functional CRUD operations
- Responsive design implemented
- Role-based access control working
- Transaction flow complete
- Stock management operational
- Ready for deployment

This is a production-ready inventory and transaction management system for warehouses and merchants.
