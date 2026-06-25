import logger from "../logger";

const TYPE_WEIGHT = { placement: 3, result: 2, event: 1 };

export function priorityScore(notification) {
  const weight = TYPE_WEIGHT[notification.type?.toLowerCase()] ?? 0;
  const ts = new Date(notification.timestamp ?? notification.created_at ?? 0).getTime();
  return weight * 1e13 + ts;
}

/**
 * Returns top `n` unread notifications by priority using a min-heap.
 * O(N log n) time, O(n) space — efficient as new notifications stream in.
 */
export function getTopN(notifications, n = 10) {
  logger.info("Computing priority inbox", { total: notifications.length, n });

  const unread = notifications.filter((notif) => !notif.read);
  logger.debug("Unread notifications filtered", { unreadCount: unread.length });

  const heap = [];
  const score = (i) => heap[i]._score;

  function push(item) {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (score(p) <= score(i)) break;
      [heap[p], heap[i]] = [heap[i], heap[p]];
      i = p;
    }
  }

  function pop() {
    const top = heap[0];
    const last = heap.pop();
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = 2 * i + 2;
        let s = i;
        if (l < heap.length && score(l) < score(s)) s = l;
        if (r < heap.length && score(r) < score(s)) s = r;
        if (s === i) break;
        [heap[i], heap[s]] = [heap[s], heap[i]];
        i = s;
      }
    }
    return top;
  }

  for (const notif of unread) {
    const scored = { ...notif, _score: priorityScore(notif) };
    if (heap.length < n) {
      push(scored);
    } else if (scored._score > score(0)) {
      pop();
      push(scored);
    }
  }

  const result = heap.slice().sort((a, b) => b._score - a._score);
  logger.info("Priority inbox computed", { resultCount: result.length });
  return result;
}
