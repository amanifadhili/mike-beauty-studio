Phase 2 System Architecture

Now your platform has three operational layers.

Public Website
      │
      │ bookings
      ▼
Admin Platform (Business System)
      │
      │ Prisma ORM
      ▼
PostgreSQL Database

Inside the Admin Platform there are now five core engines:

1. Point of Sale (Walk-ins)
2. Booking Conversion Engine
3. Worker & Commission Engine
4. Accounting System
5. Reporting & Analytics
2. New Admin Dashboard Navigation

Your dashboard will expand significantly.

Dashboard
Bookings
POS (Quick Sale)
Workers
Services
Transactions
Expenses
Loans & Advances
Reports
Settings

Each module controls a specific business workflow.

3. Point of Sale (Walk-In Clients)

This is one of the most critical modules.

URL:

/admin/pos

Purpose:
Quickly record walk-in clients.

POS Interface

A fast interface similar to a restaurant cashier system.

Select Service
Assign Worker
Choose Payment Method
Confirm Sale

Example layout:

---------------------------------
SERVICE MENU
---------------------------------
Classic Lashes        20,000
Hybrid Lashes         25,000
Volume Lashes         30,000
Mega Volume           35,000

---------------------------------
WORKER
---------------------------------
Sarah
Anna
Claudine

---------------------------------
PAYMENT METHOD
---------------------------------
Cash
Mobile Money
Bank Transfer

[Confirm Transaction]

After confirmation:

Transaction created
Commission calculated
Financial records updated
4. Booking Conversion System

Bookings from the website are not yet financial transactions.

They must be converted into completed services.

Workflow:

Booking Request
        │
        ▼
Admin confirms appointment
        │
        ▼
Service completed
        │
        ▼
Convert booking → transaction

This prevents false revenue records.

Dashboard example:

Booking #124
Client: Alice
Service: Hybrid Lashes
Status: Completed

[Convert to Sale]

After conversion:

Transaction created
Worker assigned
Commission calculated
Revenue recorded
5. Worker Management System

URL:

/admin/workers
Worker Profile

Each worker contains:

Name
Phone
Role
Commission Model
Commission Rate
Status

Example:

Name: Sarah
Role: Lash Technician
Commission: 40%
Status: Active
6. Commission Engine

Every service must automatically calculate worker earnings.

Two Commission Models
Percentage Model
Service Price = 30,000
Commission = 40%

Worker Earns = 12,000
Salon Share = 18,000
Fixed Model
Service Price = 30,000
Worker Earns = 10,000
Salon Share = 20,000
Calculation Logic
transaction_price
worker_commission
salon_share

This happens automatically during transaction creation.

7. Worker Portal

Workers should have restricted access.

Route:

/worker/dashboard

Workers see:

Today's Services
Weekly Earnings
Unpaid Balance
Payment History

Example:

Worker Dashboard

Today's Jobs
Hybrid Lashes
Classic Refill

Earnings Today
15,000

Unpaid Balance
120,000

Workers cannot see financial reports.

8. Financial Accounting Engine

Now the system tracks every money movement.

Main Ledger Types
Income
Expenses
Worker Payments
Client Credit
Worker Advances

Everything becomes traceable.

9. Transaction System

All services generate a Transaction Record.

Table example:

Transaction
id
clientName
serviceId
workerId
price
workerCommission
salonShare
paymentMethod
source (booking | walk-in)
date

Example record:

Client: Alice
Service: Hybrid Lashes
Worker: Sarah
Price: 25,000

Worker Commission: 10,000
Salon Share: 15,000
Payment Method: Mobile Money
10. Payment Method Tracking

Each transaction must store:

Cash
Mobile Money
Bank Transfer

Why?

So the physical cash matches system records.

Example:

Daily report:

Cash: 150,000
Mobile Money: 90,000
Bank: 40,000
11. Expense Management

URL:

/admin/expenses

Owner records operational costs.

Example categories:

Rent
Electricity
Internet
Supplies
Equipment
Maintenance

Expense entry example:

Expense: Lash Supplies
Amount: 60,000
Category: Supplies
Date: Today
12. Worker Payment Settlement

Workers accumulate unpaid commission balances.

Example:

Worker: Sarah
Unpaid Balance: 200,000

Owner clicks:

[Pay Worker]

System performs:

Balance → 0
Expense created
Payment recorded

Expense record:

Worker Payment
Amount: 200,000

This ensures accurate accounting.

13. Staff Advances / Loans

Workers may request salary advances.

Example:

Worker: Sarah
Advance: 50,000

Next payout:

Balance: 200,000
Advance: 50,000

Payment = 150,000

System auto-deducts.

14. Client Credit System

Sometimes clients pay later.

Example:

Service Price: 30,000
Paid: 10,000
Remaining: 20,000

Record:

Client Credit
Outstanding Balance
Payment History

Later:

Client pays remaining 20,000
Credit cleared
15. Daily Financial Dashboard

Admin homepage becomes financial overview.

Example cards:

Today's Revenue
Today's Expenses
Net Profit
Pending Worker Payments

Example:

Revenue: 450,000
Expenses: 120,000
Profit: 330,000
16. Weekly / Monthly Reports

Report types:

Financial Reports
Daily P&L
Weekly P&L
Monthly P&L

Example:

Total Income: 5,200,000
Total Expenses: 2,100,000
Net Profit: 3,100,000
Payment Method Report
Cash: 2,000,000
Mobile Money: 2,800,000
Bank: 400,000
Worker Performance
Top Workers

Sarah
Revenue Generated: 1,200,000

Anna
Revenue Generated: 900,000
17. Database Design (Professional Schema)

Important tables:

users
workers
services
bookings
transactions
expenses
worker_payments
worker_advances
client_credits
payment_methods
audit_logs
18. Audit Logging (Very Important)

Every financial change must be logged.

Example:

User: Admin
Action: Updated Transaction
Old Price: 25,000
New Price: 30,000
Time: 2026-03-14

This prevents fraud.

19. Financial Integrity Rules

Your system must enforce:

Transactions cannot be deleted (only reversed)

Every payment has a method

Worker commission is immutable after transaction

Expenses must have category

Audit logs record all changes

20. Security Design

Protect financial data with:

Role-based access
Encrypted sessions
Secure API routes
Transaction validation

Roles:

Owner
Admin
Worker
21. Suggested Folder Architecture
/app/admin
   /pos
   /workers
   /transactions
   /expenses
   /loans
   /reports

/app/worker
   /dashboard
   /earnings

/lib
   commission-engine
   accounting-engine
   report-engine
22. Automation Logic

The automated loop becomes:

Service performed
       │
       ▼
Transaction created
       │
       ▼
Commission calculated
       │
       ▼
Worker balance updated
       │
       ▼
Salon revenue recorded
23. Advanced Features (Future Phase)

Potential upgrades:

Inventory tracking
Product sales
SMS notifications
Automated reminders
Tax reporting
Multi-branch support
24. Why This System Is Powerful

After Phase 2 the owner can:

• see real profit
• track worker performance
• monitor cash flow
• manage staff payments
• record walk-ins
• run the entire studio digitally

This is essentially a complete beauty studio operating system.