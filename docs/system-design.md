
---

# 4️⃣ `docs/system-design.md`  
### (INTERVIEW + VIVA GOLD)

```md
# System Design Overview

This project follows a **backend-first architecture**, prioritizing data integrity and system behavior.

---

## Architecture Diagram (Logical)

Frontend (React)
    ↓
Firebase Authentication
    ↓
Backend (Node.js + Express)
    ↓
MongoDB Atlas

---

## Authentication Flow

1. User logs in via Firebase
2. Firebase issues ID token
3. Backend verifies token
4. User synced with MongoDB

---

## Why Firebase Auth?

- Secure credential handling
- Scalable authentication
- Industry-proven solution
- Backend remains stateless

---

## API Design Principles

- RESTful endpoints
- Token-based authorization
- Separation of concerns
- Clear role boundaries

---

## Scalability Considerations

- Indexed feed queries
- Stateless backend
- Cloud-hosted database
- Modular architecture

---

## Design Philosophy

This system prioritizes:
- correctness over features
- explainability over complexity
- real-world relevance over clones
