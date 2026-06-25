const LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
const CURRENT_LEVEL = LEVELS.DEBUG;

function format(level, message, meta) {
  const ts = new Date().toISOString();
  const base = `[${ts}] [${level}] ${message}`;
  return meta ? `${base} ${JSON.stringify(meta)}` : base;
}

function log(level, message, meta) {
  if (LEVELS[level] < CURRENT_LEVEL) return;
  const entry = format(level, message, meta);
  // eslint-disable-next-line no-console
  console[level === "ERROR" ? "error" : level === "WARN" ? "warn" : "log"](entry);
}

const logger = {
  debug: (msg, meta) => log("DEBUG", msg, meta),
  info:  (msg, meta) => log("INFO",  msg, meta),
  warn:  (msg, meta) => log("WARN",  msg, meta),
  error: (msg, meta) => log("ERROR", msg, meta),
};

export default logger;
