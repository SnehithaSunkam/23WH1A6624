import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import logger from "../logger";

const FILTERS = ["All", "Placement", "Result", "Event"];

export function NotificationFilter({ value, onChange }) {
  const handleChange = (_, newValue) => {
    if (newValue === null) return;
    logger.info("Filter changed", { filter: newValue });
    onChange(newValue);
  };

  return (
    <ToggleButtonGroup
      value={value ?? "All"}
      exclusive
      onChange={handleChange}
      size="small"
      sx={{ flexWrap: "wrap", gap: 0.5 }}
    >
      {FILTERS.map((type) => (
        <ToggleButton key={type} value={type} sx={{ textTransform: "none", px: 2 }}>
          {type}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
