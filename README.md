# 🩸 Blood Donation Platform – Backend API

This repository contains the **backend API** for the Blood Donation Platform. The system is built with **Node.js + Express**, uses **Firebase Authentication** for identity, and **Supabase (PostgreSQL)** as the main database.

This README explains:
- How authentication works
- All available API endpoints
- Who can access each endpoint
- How to test everything with Postman

---

## 🌐 Base URL

```
https://borejak-backend.vercel.app

```

For local development:
```
http://localhost:5000/api
```

---

## 🔐 Authentication (IMPORTANT)

### 🔑 Auth Strategy
This backend **does NOT have a traditional register endpoint**.

User registration and login are handled by **Firebase Authentication**.

### Auth Flow
```
Frontend → Firebase Auth (login / signup)
        ↓ Firebase ID Token
POST /auth/login
        ↓
Backend verifies token
Creates user in database if first login
Returns APP JWT
```

The returned **APP JWT** is required for all protected endpoints.

### Authorization Header
For protected endpoints, include:
```
Authorization: Bearer <APP_JWT_TOKEN>
```

---

## 1️⃣ Auth Module

### POST `/auth/login`
Login or auto-register a user via Firebase.

**Body**
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
Get current user profile.

### POST `/profile` (Auth)
Complete or update profile.

**Body**
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

**Rules**
- User must be **18+ years old**
- `blood_type` must be a valid enum

---

## 3️⃣ Events Module

### GET `/events`
List public events.

Public users only see events with status:
- `upcoming`
- `ongoing`

### GET `/events/:id`
Get event detail.

### POST `/events` (Admin)
Create event.

### PUT `/events/:id` (Admin)
Update event.

### DELETE `/events/:id` (Admin)
Cancel event (soft delete → `status = cancelled`).

---

## 🔥 Event Registration

### POST `/events/:id/register` (Auth)
Register current user for an event.

This internally creates a **donation record** with status `pending`.

**Rules**
- Event must be `upcoming` or `ongoing`
- User cannot register twice
- Event must not be full

---

## 4️⃣ Donations Module

### GET `/donations/me` (Auth)
Get current user donations.

### GET `/donations` (Admin)
List all donations.

### PUT `/donations/:id/status` (Admin)
Update donation status.

**Body**
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
Get donation benefits.

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
List blood requests / offers (public).

Query filters:
```
?type=request
?blood_type=O+
?urgency=critical
```

### POST `/blood` (Auth)
Create blood request or offer.

### POST `/blood/:id/close` (Auth)
Close own post.

### DELETE `/blood/:id` (Admin)
Expire blood market post.

---

## 7️⃣ Tips Module

### GET `/tips`
List published tips.

### POST `/tips` (Admin)
Create tip.

### DELETE `/tips/:id` (Admin)
Unpublish tip (soft delete).

---

## 8️⃣ Testimonials Module

### GET `/testimonials`
List approved testimonials.

### POST `/testimonials` (Auth)
Submit testimonial.

**Body**
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
Subscribe email.

### POST `/newsletter/unsubscribe`
Unsubscribe email.

### GET `/newsletter` (Admin)
List subscribers.

---

## 🔟 Users (Admin Module)

### GET `/users` (Admin)
List all users.

### PUT `/users/:id/role` (Admin)
Update user role.

**Body**
```json
{
  "role": "admin"
}
```

### DELETE `/users/:id` (Admin)
Deactivate user (logical deactivation).

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

### Step 2: Use token
Add header to protected routes:
```
Authorization: Bearer {{token}}
```

### Recommended Test Order
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

- Firebase handles **user registration & login**
- Backend handles **authorization, roles, and business logic**
- All deletes are **soft deletes**
- Architecture is clean and production-ready

---

🚀 **Blood Donation Platform – Backend API**

