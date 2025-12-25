# Community-Based Social Information Platform

A backend-focused social media web application designed to **surface important, trustworthy community information** using **priority-aware, trust-based feed ranking** and **accountable moderation**.

This project is built as part of a **Database Management Systems (DBMS) course project**, with an emphasis on **real-world system design**, **data modeling**, and **query optimization**, rather than UI-heavy features.

---

## 🚩 Problem Statement

In college campuses and local communities, critical information such as:
- internship alerts
- academic notices
- emergency updates
- lost & found announcements
- event notifications

is often shared through **unstructured platforms** like WhatsApp or Instagram.

### Issues with current platforms:
- Important posts get buried under noise
- No prioritization of critical information
- No accountability or audit trail
- Poor search and filtering
- No trust differentiation between users

---

## 💡 Proposed Solution

This application acts as a **community-driven information network** that:
- prioritizes important posts
- rewards trustworthy contributors
- ensures accountability through moderation and audit logs
- enables structured discovery of information

Unlike entertainment-focused social media, this platform is **utility-first** and **system-driven**.

---

## 🎯 Core Features

### 1. Priority-Aware Feed Ranking
Posts are not displayed purely by time.

Feed ranking considers:
- post priority (Emergency > Academic > General)
- user trust score
- engagement (likes, comments)
- recency (time decay)

This ensures that **important and verified information surfaces first**.

---

### 2. Structured Posts
Each post includes:
- title
- description
- category (Academic, Emergency, Internship, etc.)
- priority level
- visibility scope (community / followers)
- optional attachments

---

### 3. Role-Based Access Control (RBAC)

Users are assigned roles:
- Normal User
- Verified User
- Moderator
- Admin

Roles determine:
- posting privileges
- ability to post high-priority alerts
- moderation permissions

---

### 4. Trust & Reputation System
Each user has a trust score that:
- increases with helpful, upvoted posts
- decreases with reports or moderation actions

Trust score influences:
- feed ranking
- posting privileges

(No machine learning used — implemented purely through database logic.)

---

### 5. Moderation System
- Users can report posts
- Moderators review flagged content
- Posts are **soft-deleted**, not permanently removed

---

### 6. Audit Logging & Accountability
All sensitive actions are logged:
- post edits
- post deletions
- role changes
- moderation decisions

This mirrors **real production systems** where data recovery and traceability are critical.

---

### 7. Search & Filters
Users can filter posts by:
- category
- priority
- date range
- role of poster
- keywords

---

## 🧠 Why This Project Matters

This project demonstrates:
- real-world database schema design
- many-to-many relationships
- feed ranking logic using SQL
- role-based access control
- transactional safety
- audit trails using triggers
- performance-aware querying and indexing

The focus is on **engineering correctness and system behavior**, not UI polish.

---

## 🏗️ System Architecture

```text
Frontend (React)
    |
    | REST API
    v
Backend (Node.js + Express)
    |
    v
Database (PostgreSQL)
```
## 🗄️ Database Design Highlights

- normalized relational schema
- indexed columns for feed queries
- triggers for audit logging
- soft delete strategy
- role & permission tables
- trust score computation
## 🛠️ Tech Stack
### Layer	Technology
- Frontend: React, Tailwind CSS
- Backend: 	Node.js, Express
- Database:	PostgreSQL
- Auth:	JWT-based authentication
- Versioning:	Git & GitHub

 ## 🚀 How to Run Locally
### Backend
``` bash
cd backend
npm install
npm run dev
```
### Frontend
``` bash
cd frontend
npm install
npm start
```

## 📌 Future Enhancements

- notification system for critical posts
- analytics dashboard for admins
- rate-limiting & spam detection
- deployment on cloud platform

## 🧾 Academic Context

- Course: Database Management Systems
- Focus: schema design, query logic, system modeling
- Emphasis: real-world applicability over feature quantity

  
