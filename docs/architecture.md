# System Requirement Document: Installment Management Application

## 1. Project Overview
This application is designed to manage product installment payments and customer records efficiently. It features a role-based authorization system divided into two access levels: Admin and Staff.

---

## 2. User Roles and Authorization

### 2.1 Staff Role
- Account Creation: The Admin creates Staff accounts with a Name, Phone Number, Password, and an optional auto-generated id.
- Customer Management: Can register new customers in the system.
- Installment Entry: Can add new installment collection entries.
- Permissions: Strictly restricted to adding data. Staff members cannot edit, update, or delete any record.

### 2.2 Admin Role
- Staff Management: Has exclusive authority to create and manage Staff accounts.
- Data Management: Has full permissions to view, edit, update, and delete any customer or installment record.
- Full Access: Inherits all privileges granted to Staff members along with access to administrative tools.

---

## 3. Data Field Specifications

Every installment entry recorded in the system must collect and store the following data fields:

1. ID: Unique identifier assigned to each record.
2. Serial Number: Sequence or order tracking number.
3. Phone Number: Customer contact number.
4. Product Name: Title or description of the product purchased on installment.
5. Total Installment: Total number of installments or overall installment amount agreed upon.
6. Downpayment: Initial upfront payment made by the customer at the time of purchase.
7. Deadline: expected eng line.


---

## 4. Dashboard and Financial Metrics

The application includes a dashboard to provide financial summaries and analytics:

- Total Collection: Overall revenue calculated from all downpayments and completed installment payments.
- Installment Sub-Total: Total sum collected strictly from installment payments.
- Cash / Cash in Hand: Immediate liquid cash available, combining downpayments and overall cash collections.

---

## 5. Non-Functional Requirements

- Access Security: Role-Based Access Control must be strictly enforced across all pages and actions.
- Responsive Design: The user interface must adapt cleanly across desktop computers, tablets, and mobile devices.