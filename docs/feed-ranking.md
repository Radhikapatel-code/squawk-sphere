
---

# 2️⃣ `docs/feed-ranking.md`  
### (CORE INTELLIGENCE – VERY IMPORTANT)

```md
# Feed Ranking Logic

Unlike traditional social media feeds that rely purely on time-based ordering, this system uses a **priority-aware ranking strategy**.

---

## Ranking Objectives

1. Surface important information first
2. Reward trustworthy contributors
3. Prevent low-value content from dominating the feed

---

## Ranking Factors

Posts are ranked using the following priority order:

1. **Post Priority**
   - CRITICAL > HIGH > NORMAL
2. **Engagement**
   - Number of likes
3. **Recency**
   - Newer posts preferred

---

## MongoDB Query Logic

```js
Post.find({ isDeleted: false })
  .sort({
    priority: -1,
    likesCount: -1,
    createdAt: -1
  })
  .limit(50);
