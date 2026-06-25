import { useState, useEffect } from "react";
import { fetchNotifications } from "../api/notifications";
import { getTopN } from "../utils/priorityInbox";
import logger from "../logger";

const PAGE_SIZE = 10;

export function useNotifications(filter, page = 1, topN = 10) {
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchNotifications()
      .then((data) => {
        if (cancelled) return;
        logger.info("Notifications loaded into hook", { count: data.notifications?.length });
        setAll(data.notifications ?? []);
      })
      .catch((err) => {
        if (cancelled) return;
        logger.error("useNotifications fetch failed", { message: err.message });
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // Priority inbox: top-n unread by weight + recency
  const priorityInbox = getTopN(all, topN);
  logger.debug("Priority inbox ready", { topN: priorityInbox.length });

  // Apply type filter on ALL notifications (non-priority view)
  const filtered =
    !filter || filter === "All"
      ? all
      : all.filter((n) => n.type?.toLowerCase() === filter.toLowerCase());

  logger.debug("Filtered notifications", { filter, count: filtered.length });

  const unreadCount = all.filter((n) => !n.read).length;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return { notifications: paginated, priorityInbox, unreadCount, totalPages, loading, error };
}
