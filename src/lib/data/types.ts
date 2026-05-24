export type Role = "client" | "atelier";

export type Severity = "info" | "low" | "medium" | "high" | "critical";

export type EventType =
  | "diagnostic"
  | "intervention"
  | "vidange"
  | "freinage"
  | "pneus"
  | "controle_technique"
  | "panne"
  | "rdv";

export type Client = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  createdAt: string;
};

export type Vehicle = {
  id: string;
  clientId: string;
  brand: string;
  model: string;
  year: number;
  vin: string;
  plate: string;
  fuel: "essence" | "diesel" | "hybride" | "electrique";
  mileage: number;
  color: string;
  photoSeed: string;
  healthScore: number;
};

export type CarEvent = {
  id: string;
  vehicleId: string;
  date: string;
  type: EventType;
  severity: Severity;
  title: string;
  description: string;
  cost?: number;
  mileage: number;
  technician?: string;
  parts?: string[];
  dtcCodes?: string[];
};

export type Reminder = {
  id: string;
  vehicleId: string;
  due: string;
  type: EventType;
  label: string;
};

export type Vital = {
  key: string;
  label: string;
  value: string;
  unit: string;
  status: "ok" | "warn" | "alert";
  trend: "up" | "down" | "stable";
};
