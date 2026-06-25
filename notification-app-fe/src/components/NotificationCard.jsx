import { Box, Chip, Paper, Typography } from "@mui/material";

const TYPE_COLOR = { placement: "primary", result: "success", event: "warning" };

export function NotificationCard({ notification }) {
  const { type, title, message, timestamp, created_at, read } = notification;
  const dateStr = new Date(timestamp ?? created_at).toLocaleString();

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        opacity: read ? 0.6 : 1,
        borderLeft: read ? "3px solid transparent" : "3px solid",
        borderLeftColor: `${TYPE_COLOR[type?.toLowerCase()] ?? "grey"}.main`,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
        <Typography variant="subtitle2" fontWeight={read ? 400 : 700}>
          {title}
        </Typography>
        <Chip
          label={type}
          size="small"
          color={TYPE_COLOR[type?.toLowerCase()] ?? "default"}
          sx={{ textTransform: "capitalize", flexShrink: 0 }}
        />
      </Box>
      <Typography variant="body2" color="text.secondary" mt={0.5}>
        {message}
      </Typography>
      <Typography variant="caption" color="text.disabled" mt={0.5} display="block">
        {dateStr}
      </Typography>
    </Paper>
  );
}
