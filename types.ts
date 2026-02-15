export interface UserInputs {
  industry: string;
  mov: number;
  shifts: 1 | 2 | 3;
  scrap_percent: number;
  rework_percent: number;
  downtime_hr_wk: number;
  otd_percent: number;
  expediting_freq: 'Never' | 'Monthly' | 'Weekly' | 'Daily';
  decision_latency: 'Same shift' | '1 day' | '2-3 days' | '>3 days';
  data_discipline: 'ERP' | 'ERP+Excel' | 'Mostly Excel' | 'WhatsApp';
}

export interface UserInfo {
  companyName: string;
  email: string;
  designation: string;
}

export interface ToolDetail {
  name: string;
  category: 'Problem Solving' | 'Flow' | 'Quality' | 'Reliability' | 'Digital';
  what: string;
  when: string;
  output: string;
}

export interface CadenceItem {
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  activities: string[];
}

export interface LeakageComponent {
  label: string;
  value: number;
  inputs: string;
  formula: string;
  icon: string;
  color: string;
}

export interface LeakageReport {
  components: LeakageComponent[];
  totals: {
    total_leakage_mid: number;
    band_low: number;
    band_high: number;
    confidence: 'High' | 'Medium' | 'Low';
  };
  recoverable_90_days: {
    total_recoverable: number;
    quick_wins_value: number;
    sixty_to_ninety_value: number;
  };
}

export interface BehaviorDynamics {
  shop_floor_chemistry: {
    focus_areas: string[];
    habits_to_track: string[];
  };
}

export interface AnalysisResult {
  leakage_report: LeakageReport;
  tools_roadmap: ToolDetail[];
  execution_cadence: CadenceItem[];
  traits4xl_readiness: {
    execution_readiness_color: 'Green' | 'Amber' | 'Red';
    required_traits: string[];
  };
  behavior_dynamics: BehaviorDynamics;
}

export const TRAIT_DEFINITIONS: Record<string, string> = {
  CI: "Creative Inquiry", TS: "Technological Savvy", PO: "Process Optimization",
  SA: "Situational Awareness", ST: "Systems Thinking", SD: "Structured Drive",
  OP: "Operational Prudence", LM: "Lean Mindset", SL: "Safety Leadership",
  QF: "Quality Focus", RV: "Regulatory Vigilance", RO: "Results Orientation",
  EC: "Ethical Courage", PC: "Persuasive Confidence", CR: "Change Resilience",
  SOI: "Social Influence", IS: "Interpersonal Sensitivity", COL: "Collaboration",
  FR: "Feedback Receptiveness", LA: "Learning Agility", GM: "Growth Mindset",
  SI: "Self-Insight", SS: "Stress Stability"
};