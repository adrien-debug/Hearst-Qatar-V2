/**
 * Types pour le Mining Dashboard
 * Hearst Qatar - 100MW Bitcoin Mining Facility
 */

export interface BitcoinKPIs {
  totalHashrate: number; // PH/s
  dailyProduction: number; // BTC/day
  monthlyRevenue: number; // USD
  efficiency: number; // J/TH
  uptime: number; // %
}

export interface StrategicReserve {
  totalBTC: number;
  currentValue: number; // USD
  monthlyAccumulation: number; // BTC
  projectedYearEnd: number; // BTC
  reserveGrowth: number; // %
}

export interface HardwareStatus {
  totalMiners: number;
  activeMiners: number;
  maintenanceMiners: number;
  offlineMiners: number;
  containers: {
    total: number;
    active: number;
    maintenance: number;
  };
}

export interface PerformanceMetrics {
  avgHashratePerMiner: number; // TH/s
  avgPowerConsumption: number; // W
  avgEfficiency: number; // J/TH
  totalPowerDraw: number; // MW
}














