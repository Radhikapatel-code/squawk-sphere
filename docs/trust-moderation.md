
---

# 3️⃣ `docs/trust-moderation.md`  
### (What Makes Your Project Stand Out)

```md
# Trust Score & Moderation System

This project implements a **reputation-driven moderation model**, inspired by real-world platforms.

---

## Trust Score Rules

| Action | Trust Impact |
|-----|-------------|
| Post liked | +1 |
| Post reported | -2 |
| Post deleted by moderator | -5 |

---

## Why Trust Score Matters

- Influences feed visibility
- Determines posting privileges
- Encourages responsible behavior

---

## Moderation Workflow

1. Users report inappropriate posts
2. Moderators review flagged content
3. Posts are soft-deleted if necessary
4. Audit trail preserved

---

## Soft Delete Strategy

Posts are never permanently removed:
```json
"isDeleted": true
