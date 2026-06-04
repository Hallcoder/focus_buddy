export interface MonitoredUser {
  email: string;
  name: string;
  extensionStatus: "online" | "offline" | "possibly_uninstalled" | "uninstalled" | "unknown";
  lastSeen: string | null;
  incognitoEnabled: boolean | null;
  extensionUninstalled: boolean;
  blocked_categories: string[];
}
