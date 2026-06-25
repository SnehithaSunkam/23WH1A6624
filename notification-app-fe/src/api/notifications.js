import logger from "../logger";

const API_URL = "/api/evaluation-service/notifications";
const API_KEY = import.meta.env.VITE_API_KEY ?? "";

const MOCK = [
  { id: "1", type: "Placement", title: "Google On-Campus Drive", message: "Google will be visiting on June 10th.", timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), read: false },
  { id: "2", type: "Result", title: "Semester 4 Results Declared", message: "Check your portal for grades.", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), read: false },
  { id: "3", type: "Event", title: "Hackathon 2025", message: "Register before June 5th.", timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), read: false },
  { id: "4", type: "Placement", title: "Microsoft Internship", message: "Applications open now.", timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), read: false },
  { id: "5", type: "Result", title: "Backlog Results", message: "Results for backlog exams are out.", timestamp: new Date(Date.now() - 1000 * 3600 * 3).toISOString(), read: true },
  { id: "6", type: "Event", title: "Tech Talk: AI in Healthcare", message: "Join us this Friday at 3 PM.", timestamp: new Date(Date.now() - 1000 * 3600 * 5).toISOString(), read: false },
  { id: "7", type: "Placement", title: "Amazon SDE Hiring", message: "Off-campus drive for 2025 batch.", timestamp: new Date(Date.now() - 1000 * 3600 * 6).toISOString(), read: false },
  { id: "8", type: "Result", title: "Internal Assessment Marks", message: "IA marks uploaded on portal.", timestamp: new Date(Date.now() - 1000 * 3600 * 8).toISOString(), read: false },
  { id: "9", type: "Event", title: "Cultural Fest", message: "Annual fest on June 20th.", timestamp: new Date(Date.now() - 1000 * 3600 * 10).toISOString(), read: false },
  { id: "10", type: "Placement", title: "TCS NQT Registration", message: "Last date to register is June 8th.", timestamp: new Date(Date.now() - 1000 * 3600 * 12).toISOString(), read: false },
  { id: "11", type: "Result", title: "Project Viva Results", message: "Final year project viva results published.", timestamp: new Date(Date.now() - 1000 * 3600 * 14).toISOString(), read: false },
  { id: "12", type: "Event", title: "Sports Day", message: "Inter-department sports on June 15th.", timestamp: new Date(Date.now() - 1000 * 3600 * 16).toISOString(), read: false },
];

export async function fetchNotifications() {
  logger.info("Fetching notifications from API", { url: API_URL });
  try {
    const res = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "x-api-key": API_KEY,
      },
    });
    if (!res.ok) {
      logger.error("API responded with error", { status: res.status });
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    logger.info("Notifications fetched successfully", {
      count: data.notifications?.length ?? 0,
    });
    return data;
  } catch (err) {
    logger.warn("API unreachable, falling back to mock data", { message: err.message });
    return { notifications: MOCK };
  }
}
