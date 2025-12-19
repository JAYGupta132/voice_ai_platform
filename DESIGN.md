# Conversation Session Service


## 1. How did you ensure idempotency?

Idempotency is enforced primarily at the **database level**, not just in application logic.

### Session creation (`POST /sessions`)
- A **unique index** is defined on `sessionId`.
- Session creation uses an **atomic upsert**.
- If multiple requests attempt to create the same session concurrently:
  - MongoDB guarantees that only one document is created.
  - All callers receive the same session document.

This makes the endpoint safe for retries and network duplication.

---

### Event creation (`POST /sessions/:sessionId/events`)
- A **compound unique index** is defined on `(sessionId, eventId)`.
- Events are inserted using `create()`.
- If the same event is sent more than once:
  - MongoDB raises a duplicate key error.
  - The service catches this error and returns success without creating duplicates.

Events are **immutable** and never updated or deleted.

---

### Session completion (`POST /sessions/:sessionId/complete`)
- Completion is implemented as a **conditional update**:
  - The update only runs if the session is not already completed.
- Repeated requests do not change the state after the first successful completion.

---

## 2. How does your design behave under concurrent requests?

Concurrency safety is handled using **atomic MongoDB operations and indexes**.

### Concurrent session creation
- Multiple requests creating the same `sessionId` may race.
- MongoDB’s unique index ensures only one document exists.
- The upsert operation guarantees correctness without explicit locks.

### Concurrent event insertion
- Multiple requests inserting the same `(sessionId, eventId)` may race.
- The compound unique index prevents duplicate events.
- One request succeeds; others safely fail and are ignored.

### Concurrent session completion
- The session status update is conditional.
- Only the first request changes the state; others are no-ops.

No in-memory locks or synchronization are required, which keeps the system **horizontally scalable**.

---

## 3. What MongoDB indexes did you choose and why?

### Session Collection
- **Unique index on `sessionId`**
  - Enforces uniqueness
  - Enables idempotent session creation
  - Allows fast lookup by external session ID

### Event Collection
- **Compound unique index on `(sessionId, eventId)`**
  - Guarantees event uniqueness per session
  - Enables idempotent event ingestion
- **Index on `(sessionId, timestamp)`**
  - Optimizes ordered event retrieval
  - Supports efficient pagination for large sessions

Indexes are chosen based on **actual access patterns**, not premature optimization.

---

## 4. How would you scale this system for millions of sessions per day?

At higher scale, the following strategies would be applied:

### Data scaling
- **Shard MongoDB by `sessionId`**
  - Sessions are naturally partitionable
- Separate hot (active) sessions from cold (completed) sessions
- Archive completed sessions to cheaper storage if needed

### API scaling
- Stateless NestJS services behind a load balancer
- Horizontal scaling without coordination due to DB-level idempotency

### Query optimization
- Cursor-based pagination for very large event streams
- Read replicas for heavy read workloads

These optimizations are intentionally **not implemented** in this assignment.

---

## 5. What did you intentionally keep out of scope, and why?

The following were intentionally excluded to keep the solution focused and correct:

- Authentication and authorization
- Background jobs or message queues
- WebSockets or real-time streaming
- Soft deletes or versioning
- Advanced validation and schema migrations
- Extensive automated tests

These features are important in production systems but are not required to demonstrate **core backend design, idempotency, and concurrency handling** for this assignment.

---
