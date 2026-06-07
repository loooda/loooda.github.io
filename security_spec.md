# Security Specification

## 1. Data Invariants
- A UserProfile must match the authenticated `request.auth.uid`.
- Immutable fields (`uid`, `email`) must not be updated.
- A user can only access, create, update, or delete their own notification subcollection item.
- Schema, value size, and type boundaries must be strictly executed block-by-block.

## 2. The "Dirty Dozen" Payloads
Twelve payloads to test against state and identity rules:
1. Impersonate another user ID on profile `create`: `{"uid": "attacker_id", "email": "victim@domain.com"}` (expected output: `PERMISSION_DENIED`).
2. Impersonate another user ID on notification `create` inside a different user's path (expected output: `PERMISSION_DENIED`).
3. Modify email or uid (immutability check) of profile: `{"uid": "new_id"}` (expected output: `PERMISSION_DENIED`).
4. Overly long display name in UserProfile (> 128 chars) (expected output: `PERMISSION_DENIED`).
5. Overly long photoURL size (> 512 chars) (expected output: `PERMISSION_DENIED`).
6. Custom invalid keys in UserProfile (ghost fields check) (expected output: `PERMISSION_DENIED`).
7. Bypassing category limits in UserProfile (> 20 values) (expected output: `PERMISSION_DENIED`).
8. Invalid type assignment of favorite categories (not a list) (expected output: `PERMISSION_DENIED`).
9. Notification item overwrite other fields of notification than the `read` flag (expected output: `PERMISSION_DENIED`).
10. Notification item title payload exceeds 256 bytes (expected output: `PERMISSION_DENIED`).
11. Notification list access requested by a non-authenticated user (expected output: `PERMISSION_DENIED`).
12. Attempt to delete another user's profile resource (expected output: `PERMISSION_DENIED`).

## 3. Test Runner Configurations
Test runner setup inside `firestore.rules.test.ts`. This confirms secure sandboxing matching Zero-Trust architectures.
