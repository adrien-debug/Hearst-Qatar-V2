/**
 * Types pour Infrastructure Monitoring
 * Hearst Qatar - 100MW Bitcoin Mining Facility
 */

export type SystemStatus = 'online' | 'warning' | 'offline' | 'maintenance';
export type AlertType = 'critical' | 'warning' | 'info';

export interface PowerSystem {
  id: string;
  name: string;
  status: SystemStatus;
  currentLoad: number; // MW
  capacity: number; // MW
  efficiency: number; // %
  temperature: number; // °C
  voltage: number; // kV
  lastMaintenance: Date;
  nextMaintenance: Date;
}

export interface CoolingSystem {
  id: string;
  name: string;
  status: SystemStatus;
  flowRate: number; // L/min
  temperature: {
    input: number;
    output: number;
  };
  pressure: number; // bar
  efficiency: number; // %
  lastMaintenance: Date;
}

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  systemId?: string;
  priority: number; // 1-5 (5 = highest)
}

export interface NetworkStatus {
  uptime: number; // %
  latency: number; // ms
  bandwidth: number; // Mbps
  connectedDevices: number;
  status: SystemStatus;
}

export interface SecurityStatus {
  accessControlStatus: SystemStatus;
  cameraSystemStatus: SystemStatus;
  fireSuppressionStatus: SystemStatus;
  lastSecurityCheck: Date;
  activeAlerts: number;
}














