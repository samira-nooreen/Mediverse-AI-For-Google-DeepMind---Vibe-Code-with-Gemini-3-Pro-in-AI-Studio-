export enum AppModule {
  TRIAGE = 'TRIAGE',
  QUEUE = 'QUEUE',
  MEDICINE = 'MEDICINE',
  DIARY = 'DIARY',
  DISCHARGE = 'DISCHARGE',
  SURGERY = 'SURGERY',
  NAV = 'NAV',
}

export interface TriageResponse {
  severity: string;
  condition: string;
  steps: string[];
  priority: 'Red' | 'Yellow' | 'Green';
  visitNeeded: boolean;
  explanation: string;
}

export interface QueueResponse {
  patientCount: number;
  waitTimeMinutes: number;
  lowTrafficWindow: string;
  crowdStatus: string;
}

export interface MedicineResponse {
  medicines: string[];
  interactions: string[];
  schedule: string;
  warnings: string[];
}

export interface DiaryResponse {
  score: number;
  diagnosis: string;
  report: string;
}

export interface DischargeResponse {
  summary: string;
  medicines: string[];
  reminders: string[];
  dangerSigns: string[];
}

export interface RiskResponse {
  riskScore: number;
  analysis: string;
  checklist: string[];
  guidelines: string[];
  riskFactors: { name: string; value: number }[]; // For chart
}

export interface NavResponse {
  location: string;
  route: string;
  distanceTime: string;
  delays: string;
}