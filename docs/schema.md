# Database Schema Design

This project uses **MongoDB Atlas** as the primary database.  
The schema is designed to support **scalability, moderation, and feed ranking**, while maintaining clarity and normalization.

---

## User Collection

```json
{
  "_id": ObjectId,
  "firebaseUid": String,
  "name": String,
  "email": String,
  "role": "USER | VERIFIED | MODERATOR | ADMIN",
  "trustScore": Number,
  "createdAt": Date,
  "updatedAt": Date
}
{
  "_id": ObjectId,
  "author": ObjectId,
  "title": String,
  "content": String,
  "category": String,
  "priority": String,
  "likesCount": Number,
  "likedBy": [ObjectId],
  "reportsCount": Number,
  "reportedBy": [ObjectId],
  "isDeleted": Boolean,
  "createdAt": Date,
  "updatedAt": Date
}
