# Notification System Design

## Stage 1

### Problem
Users lose track of important notifications due to high volume. A Priority Inbox must surface the top `n` most important **unread** notifications, ranked by a combination of **type weight** and **recency**.

---

### Priority Score Formula

```
score = typeWeight × 10¹³ + timestamp_ms
```

| Type      | Weight |
|-----------|--------|
| Placement | 3      |
| Result    | 2      |
| Event     | 1      |

- Type weight dominates so a newer Event never outranks an older Placement.
- Timestamp (milliseconds) is the tiebreaker within the same type.
- Only **unread** notifications are eligible for the Priority Inbox.

---

### Algorithm: Min-Heap for Top-N

A **min-heap of size `n`** is maintained while iterating all unread notifications:

- If heap has fewer than `n` items → push.
- Else if the new item's score > heap root (minimum in heap) → pop root, push new item.

**Complexity:** O(N log n) time, O(n) space.

This is efficient for streaming/real-time scenarios: as new notifications arrive, each is processed in O(log n) — the heap always holds the current top-n without re-sorting all data.

---

### Handling New Incoming Notifications

The `getTopN` utility is a **pure function** — it is called on every render cycle with the latest full notification list. In a real-time scenario (e.g. WebSocket), the notification array in state would be updated with new arrivals and `getTopN` would re-compute in O(N log n), which is fast enough for the expected scale. For very high-frequency streams, the heap could be maintained incrementally as a persistent data structure updated on each push event.

---

### Component Architecture

```
App
└── NotificationsPage
    ├── NotificationFilter       ← type filter (All / Placement / Result / Event)
    ├── [Tab 0] All Notifications (paginated, filterable)
    └── [Tab 1] Priority Inbox   ← top-n unread by score, no pagination needed
        └── NotificationCard (×n)
```

---

### Logging

Every significant operation (fetch, filter, pagination, priority computation) is instrumented via the custom `logger` middleware (`src/logger.js`), which emits structured `[ISO timestamp] [LEVEL] message {meta}` lines. No `console.log` is used directly in application code.
