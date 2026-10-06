export type MainTab = "dashboard" | "employees" | "resigned" | "reports" | "trash" | "logs";

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  detail: string;
  type: "info" | "success" | "warning" | "danger";
}
