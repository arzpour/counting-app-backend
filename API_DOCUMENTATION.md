# API Documentation - New Structure

## Overview

This document describes the new API structure for the accounting application. The system has been completely refactored to use a more modern and normalized database schema.

## Database Collections

### 1. **Vehicles** (`/api/vehicles`)

Stores vehicle information with VIN as the primary identifier.

**Endpoints:**

- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/id/:id` - Get vehicle by MongoDB ID
- `GET /api/vehicles/vin/:vin` - Get vehicle by VIN
- `POST /api/vehicles` - Create new vehicle
- `PUT /api/vehicles/id/:id` - Update vehicle
- `DELETE /api/vehicles/id/:id` - Delete vehicle

### 2. **Deals** (`/api/deals`)

Stores purchase and sale transactions for vehicles.

**Endpoints:**

- `GET /api/deals` - Get all deals
- `GET /api/deals/id/:id` - Get deal by ID
- `GET /api/deals/vehicle/:vehicleId` - Get deals by vehicle ID
- `GET /api/deals/vin/:vin` - Get deals by VIN
- `GET /api/deals/person/:personId` - Get deals by person (returns sales, purchases, partnerships)
- `GET /api/deals/status/:status` - Get deals by status
- `POST /api/deals` - Create new deal
- `PUT /api/deals/id/:id` - Update deal
- `DELETE /api/deals/id/:id` - Delete deal

### 3. **People** (`/api/people`)

Stores information about all people (buyers, sellers, brokers, employees, etc.)

**Endpoints:**

- `GET /api/people` - Get all people
- `GET /api/people/id/:id` - Get person by ID
- `GET /api/people/national-id/:nationalId` - Get person by national ID
- `GET /api/people/role/:role` - Get people by role
- `GET /api/people/search/:name` - Search people by name
- `POST /api/people` - Create new person
- `PUT /api/people/id/:id` - Update person
- `PUT /api/people/id/:id/wallet` - Update wallet balance
- `DELETE /api/people/id/:id` - Delete person

### 4. **Cheques** (`/api/cheques`)

Stores cheque information with payer/payee details.

**Endpoints:**

- `GET /api/cheques` - Get all cheques
- `GET /api/cheques/id/:id` - Get cheque by ID
- `GET /api/cheques/deal/:dealId` - Get cheques by deal ID
- `GET /api/cheques/person/:personId` - Get cheques by person (returns issued and received)
- `GET /api/cheques/status/:status` - Get cheques by status
- `GET /api/cheques/unpaid/deal/:dealId` - Get unpaid cheques for a deal
- `POST /api/cheques` - Create new cheque
- `POST /api/cheques/id/:id/action` - Add action to cheque
- `PUT /api/cheques/id/:id` - Update cheque
- `DELETE /api/cheques/id/:id` - Delete cheque

### 5. **Transactions** (`/api/transactions`)

Stores financial transactions.

**Endpoints:**

- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/id/:id` - Get transaction by ID
- `GET /api/transactions/deal/:dealId` - Get transactions by deal ID
- `GET /api/transactions/person/:personId` - Get transactions by person ID
- `GET /api/transactions/account/:accountId` - Get transactions by business account ID
- `GET /api/transactions/type/:type` - Get transactions by type
- `GET /api/transactions/date-range?startDate=...&endDate=...` - Get transactions by date range
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/id/:id` - Update transaction
- `DELETE /api/transactions/id/:id` - Delete transaction

### 6. **Business Accounts** (`/api/business-accounts`)

Stores business bank accounts.

**Endpoints:**

- `GET /api/business-accounts` - Get all business accounts
- `GET /api/business-accounts/active` - Get active business accounts
- `GET /api/business-accounts/id/:id` - Get business account by ID
- `GET /api/business-accounts/account-number/:accountNumber` - Get by account number
- `POST /api/business-accounts` - Create new business account
- `PUT /api/business-accounts/id/:id` - Update business account
- `PUT /api/business-accounts/id/:id/balance` - Update account balance
- `DELETE /api/business-accounts/id/:id` - Delete business account

### 7. **Salaries** (`/api/salaries`)

Stores employee salary records.

**Endpoints:**

- `GET /api/salaries` - Get all salaries
- `GET /api/salaries/id/:id` - Get salary by ID
- `GET /api/salaries/employee/:personId` - Get salaries by employee
- `GET /api/salaries/period/:year/:month` - Get salaries by period
- `GET /api/salaries/year/:year` - Get salaries by year
- `POST /api/salaries` - Create new salary record
- `PUT /api/salaries/id/:id` - Update salary
- `DELETE /api/salaries/id/:id` - Delete salary

### 8. **Expenses** (`/api/expenses`)

Stores business expenses.

**Endpoints:**

- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/id/:id` - Get expense by ID
- `GET /api/expenses/category/:category` - Get expenses by category
- `GET /api/expenses/recipient/:personId` - Get expenses by recipient
- `GET /api/expenses/date-range?startDate=...&endDate=...` - Get expenses by date range
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/id/:id` - Update expense
- `DELETE /api/expenses/id/:id` - Delete expense

### 9. **Loans** (`/api/loans`)

Stores employee loan records.

**Endpoints:**

- `GET /api/loans` - Get all loans
- `GET /api/loans/id/:id` - Get loan by ID
- `GET /api/loans/borrower/:personId` - Get loans by borrower
- `GET /api/loans/status/:status` - Get loans by status
- `POST /api/loans` - Create new loan
- `PUT /api/loans/id/:id` - Update loan
- `PUT /api/loans/id/:id/installment/:installmentNumber` - Update installment status
- `DELETE /api/loans/id/:id` - Delete loan

### 10. **Authentication** (`/api/auth`)

Authentication endpoints (unchanged from previous structure).

### 11. **Settings** (`/api/settings`)

Application settings (unchanged from previous structure).

## Key Changes from Old Structure

### Old Structure:

- **Cars**: Combined purchase and sale data in one record with ChassisNo
- **Cheques**: Used CarChassisNo field
- **Transactions**: Used ChassisNo field
- Data was denormalized with redundant information

### New Structure:

- **Vehicles**: Separate vehicle entity with VIN
- **Deals**: Separate entity for each purchase/sale transaction
- **People**: Centralized person entity with roles
- **Cheques**: Related to deals and people
- **Transactions**: Related to deals, people, and business accounts
- Additional entities: BusinessAccounts, Salaries, Expenses, Loans

## Migration Notes

The new structure provides:

1. Better data normalization
2. Elimination of data redundancy
3. Clearer relationships between entities
4. Support for complex business scenarios (partnerships, broker commissions, etc.)
5. Comprehensive wallet system for people
6. Detailed tracking of loans and salaries

## TypeScript Interfaces

All models are based on TypeScript interfaces located in `/types/` directory:

- `vehicles.ts`
- `deals.ts`
- `people.ts`
- `cheque.ts`
- `transaction.ts`
- `business_accounts.ts`
- `salaries.ts`
- `expenses.ts`
- `loans.ts`
