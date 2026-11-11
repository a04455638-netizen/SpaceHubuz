let maintenanceModeEnabled = false;

export function isMaintenanceMode(): boolean {
  if (process.env.MAINTENANCE_MODE === "true") {
    return true;
  }
  return maintenanceModeEnabled;
}

export function setMaintenanceMode(enabled: boolean): void {
  maintenanceModeEnabled = enabled;
}
