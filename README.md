# 🩸 Blood Donation Platform – Backend API

This repository contains the **backend API** for the **Blood Donation Platform (Borejak)**.
The system is built with **Node.js + Express**, uses **Firebase Authentication** for identity management, and **Supabase (PostgreSQL)** as the primary database.

This backend is responsible for:

* Authentication & authorization
* Business logic (donation rules, roles, eligibility)
* Secure API endpoints
* Data persistence and validation

---

## 🌐 Base URL

### Production

```
https://borejak-backend.vercel.app/api
```

### Local Development

```
http://localhost:5000/api
```

---

## 🔐 Authentication (IMPORTANT)

### 🔑 Authentication Strategy

This backend **does NOT implement traditional email/password authentication**.

All user authentication is handled by **Firebase Authentication**.

### 🔄 Authentication Flow

```
Frontend → Firebase Authentication (Login / Signup)
        ↓ Firebase ID Token
POST /auth/login
        ↓
Backend verifies Firebase token
Creates user in database if first login
Returns Application JWT (APP_JWT)
```

The returned **APP_JWT** must be used for all protected API requests.

### 🔒 Authorization Header

Include this header for all protected endpoints:

```
Authorization: Bearer <APP_JWT>
```

---

## 1️⃣ Authentication Module

### POST `/auth/login`

Login or auto-register a user using a Firebase ID token.

**Request Body**

```json
{
  "firebaseToken": "FIREBASE_ID_TOKEN"
}
```

**Response**

```json
{
  "success": true,
  "token": "APP_JWT_TOKEN",
  "profile_completed": false,
  "user": {
    "id": "uuid",
    "email": "user@gmail.com",
    "role": "user"
  }
}
```

---

## 2️⃣ Profile Module

### GET `/profile` (Auth)

Retrieve the authenticated user profile.

### POST `/profile` (Auth)

Create or update user profile.

**Request Body**

```json
{
  "full_name": "John Doe",
  "phone_number": "012345678",
  "blood_type": "O+",
  "date_of_birth": "2000-01-01",
  "gender": "male",
  "address": "Phnom Penh",
  "avatar_url": "https://..."
}
```

**Validation Rules**

* User must be **18+ years old**
* `blood_type` must be a valid enum

---

## 3️⃣ Events Module

### GET `/events`

List public events.

Visible statuses:

* `upcoming`
* `ongoing`

### GET `/events/:id`

Get event details.

### POST `/events` (Admin)

Create a new event.

### PUT `/events/:id` (Admin)

Update event details.

### DELETE `/events/:id` (Admin)

Cancel event (soft delete → `status = cancelled`).

---

## 🔥 Event Registration

### POST `/events/:id/register` (Auth)

Register current user for an event.

This action automatically creates a **donation record** with status `pending`.

**Rules**

* Event must be `upcoming` or `ongoing`
* User cannot register more than once
* Event must not exceed capacity

---

## 4️⃣ Donations Module

### GET `/donations/me` (Auth)

Retrieve donation history for the current user.

### GET `/donations` (Admin)

List all donation records.

### PUT `/donations/:id/status` (Admin)

Update donation status.

**Request Body**

```json
{
  "status": "completed",
  "quantity_ml": 350,
  "notes": "Healthy donor"
}
```

---

## 5️⃣ Benefits Module

### GET `/benefits/me` (Auth)

Retrieve donation benefits and eligibility.

**Response**

```json
{
  "total_donations": 3,
  "level": "silver",
  "eligible": true,
  "next_eligible_date": null
}
```

---

## 6️⃣ Blood Market Module

### GET `/blood`

List public blood requests and offers.

**Query Filters**

```
?type=request
?blood_type=O+
?urgency=critical
```

### POST `/blood` (Auth)

Create a blood request or donation offer.

### POST `/blood/:id/close` (Auth)

Close own blood market post.

### DELETE `/blood/:id` (Admin)

Expire a blood market post.

---

## 7️⃣ Tips Module

### GET `/tips`

Retrieve published donation tips.

### POST `/tips` (Admin)

Create a new tip.

### DELETE `/tips/:id` (Admin)

Unpublish tip (soft delete).

---

## 8️⃣ Testimonials Module

### GET `/testimonials`

Retrieve approved testimonials.

### POST `/testimonials` (Auth)

Submit a testimonial.

**Request Body**

```json
{
  "content": "Great experience!",
  "rating": 5
}
```

### PUT `/testimonials/admin/:id/approve` (Admin)

Approve testimonial.

---

## 9️⃣ Newsletter Module

### POST `/newsletter/subscribe`

Subscribe email to newsletter.

### POST `/newsletter/unsubscribe`

Unsubscribe email.

### GET `/newsletter` (Admin)

List all subscribers.

---

## 🔟 Users Module (Admin)

### GET `/users`

List all users.

### PUT `/users/:id/role`

Update user role.

**Request Body**

```json
{
  "role": "admin"
}
```

### DELETE `/users/:id`

Deactivate user (logical deletion).

---

## 🧪 Postman Testing Guide

### Step 1: Login

```
POST /auth/login
```

Save token in Postman:

```js
pm.environment.set("token", pm.response.json().token);
```

### Step 2: Use Token

Add header to protected requests:

```
Authorization: Bearer {{token}}
```

### Recommended Test Flow

1. `/auth/login`
2. `/profile`
3. `/events`
4. `/events/:id/register`
5. `/donations/me`
6. `/benefits/me`
7. `/blood`
8. Admin endpoints

---

## ✅ Summary

* Firebase handles **authentication**
* Backend handles **authorization & business logic**
* Role-based access control (User / Admin)
* Soft deletes for data integrity
* Production-ready REST API architecture

---

🚀 **Blood Donation Platform – Backend API**
