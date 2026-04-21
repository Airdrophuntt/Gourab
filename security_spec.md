# Blog Website Security Specification

## Data Invariants
1. A post must have a title, content, authorId, and createdAt timestamp.
2. Only authenticated admins can create, update, or delete posts.
3. Public users can only read published posts.
4. Images uploaded to Storage must be referenced correctly in Firestore.

## The "Dirty Dozen" Payloads (WIP)
... to be defined during implementation ...
