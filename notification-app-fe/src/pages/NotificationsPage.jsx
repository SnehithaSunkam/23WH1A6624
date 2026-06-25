import { useState } from "react";
import {
  Alert,
  Badge,
  Box,
  CircularProgress,
  Divider,
  Pagination,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";

import { NotificationCard } from "../components/NotificationCard";
import { NotificationFilter } from "../components/NotificationFilter";
import { useNotifications } from "../hooks/useNotifications";
import logger from "../logger";

export function NotificationsPage() {
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState(0);
  const [topN] = useState(10);

  const { notifications, priorityInbox, unreadCount, totalPages, loading, error } =
    useNotifications(filter, page, topN);

  const handleFilterChange = (newFilter) => {
    logger.info("Filter applied", { newFilter });
    setFilter(newFilter);
    setPage(1);
  };

  const handlePageChange = (_, newPage) => {
    logger.info("Page changed", { newPage });
    setPage(newPage);
  };

  const handleTabChange = (_, newTab) => {
    logger.info("Tab switched", { tab: newTab === 0 ? "All" : "Priority Inbox" });
    setTab(newTab);
  };

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", px: 2, py: 4 }}>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <Badge badgeContent={unreadCount} color="primary" max={99}>
          <NotificationsIcon sx={{ fontSize: 28 }} />
        </Badge>
        <Typography variant="h5" fontWeight={700}>
          Notifications
        </Typography>
      </Stack>

      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="All Notifications" />
        <Tab
          label={
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <StarIcon fontSize="small" />
              <span>Priority Inbox (Top {topN})</span>
            </Stack>
          }
        />
      </Tabs>

      <Divider sx={{ mb: 3 }} />

      {tab === 0 && (
        <Box sx={{ mb: 3 }}>
          <NotificationFilter value={filter} onChange={handleFilterChange} />
        </Box>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error">Failed to load notifications: {error}</Alert>
      )}

      {!loading && !error && tab === 1 && (
        priorityInbox.length === 0 ? (
          <Alert severity="info">No unread notifications.</Alert>
        ) : (
          <Stack spacing={1.5}>
            {priorityInbox.map((n) => (
              <NotificationCard key={n.id} notification={n} />
            ))}
          </Stack>
        )
      )}

      {!loading && !error && tab === 0 && (
        notifications.length === 0 ? (
          <Alert severity="info">No notifications found.</Alert>
        ) : (
          <>
            <Stack spacing={1.5}>
              {notifications.map((n) => (
                <NotificationCard key={n.id} notification={n} />
              ))}
            </Stack>
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
              />
            </Box>
          </>
        )
      )}
    </Box>
  );
}
