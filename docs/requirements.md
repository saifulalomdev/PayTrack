# System Requirement Document: Installment Management Application

## 1. Introduction
This system is designed to simplify installment calculations and customer management. The application will have two specific user roles: **Admin** and **Staff**.

---

## 2. User Roles & Permissions

### 2.1 Staff
- Can create new users or customers.
- Can add new installment entries.
- **Restriction:** Staff cannot edit, update, or delete any installment or data.

### 2.2 Admin
- Has access to all features available to Staff.
- Can edit and update information for any customer or installment.
- Has full authorization to modify or delete data.
- Can view the complete system dashboard overview.

---

## 3. Data Fields
The following information must be saved for each installment record:

1. **ID:** System-generated unique identifier.
2. **Serial Number:** Order sequence number.
3. **Phone Number:** Customer contact number.
4. **Product Name:** Name of the sold item.
5. **Total Installment:** Total number of installments or total installment value.
6. **Downpayment:** Initial cash paid upfront.

---

## 4. Dashboard & Analytics
The dashboard will display a clear overview of the business's financial status:

- **Total Collection:** Total money collected from installments and downpayments combined.
- **Sub-Total within Installments:** Total money collected specifically from installments to date.
- **Cash / Cash in Hand:** Immediate cash available on hand (downpayment + recent cash payments).

---

## 5. Non-Functional Requirements
- **Security:** Role-Based Access Control (RBAC) must be strictly enforced.
- **Responsive UI:** The application interface must be easy to use on both mobile and desktop devices.