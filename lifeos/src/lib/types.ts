export type TaskStatus = "open" | "waiting" | "done" | "dropped";
export type ProjectStatus = "active" | "waiting" | "someday" | "done";
export type CaptureStatus = "routed" | "inbox" | "dismissed";
export type MetricType = "glucose_avg" | "hrv" | "weight" | "sleep";

export interface Area {
  id: string;
  name: string;
  icon: string | null;
  sort_order: number;
}

export interface Project {
  id: string;
  area_id: string | null;
  name: string;
  status: ProjectStatus;
  target_date: string | null;
  notes: string | null;
  updated_at: string;
}

export interface Task {
  id: string;
  project_id: string | null;
  area_id: string | null;
  title: string;
  notes: string | null;
  due_date: string | null;
  due_time: string | null;
  priority: number;
  status: TaskStatus;
  waiting_on: string | null;
  recurrence_rule: string | null;
  reminder_offsets: number[];
  created_via: string;
  completed_at: string | null;
  created_at: string;
}

export interface Capture {
  id: string;
  raw_text: string;
  source: string;
  parsed_json: ParsedCapture | null;
  confidence: number | null;
  routed_to_table: string | null;
  routed_to_id: string | null;
  status: CaptureStatus;
  created_at: string;
}

export interface Contact {
  id: string;
  name: string;
  relationship: string | null;
  context_notes: string | null;
  last_touch: string | null;
  next_touch_due: string | null;
  linked_area: string | null;
}

export interface Trip {
  id: string;
  name: string;
  destination: string | null;
  start_date: string | null;
  end_date: string | null;
  status: "idea" | "booked" | "packing" | "done";
  checklist_json: { item: string; done: boolean }[];
  notes: string | null;
}

export interface Decision {
  id: string;
  area_id: string | null;
  name: string;
  options_json: string[];
  criteria_json: {
    criterion: string;
    weight: number;
    scores: Record<string, number>;
  }[];
  status: "open" | "decided" | "abandoned";
  outcome: string | null;
  notes: string | null;
}

export interface Habit {
  id: string;
  name: string;
  schedule: string;
  streak_current: number;
  streak_best: number;
  notify_time: string | null;
  track_value: boolean;
  value_label: string | null;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  date: string;
  done: boolean;
  value: number | null;
}

export interface Metric {
  id: string;
  type: MetricType;
  value: number;
  unit: string | null;
  recorded_at: string;
  source: string;
}

export interface WealthSnapshot {
  id: string;
  net_worth: number | null;
  savings_goal_progress: number | null;
  month_spend: number | null;
  recorded_at: string;
}

/** Shape returned by the Haiku capture parser. */
export interface ParsedCapture {
  type:
    | "task"
    | "note"
    | "contact_touch"
    | "metric"
    | "habit_log"
    | "trip_item"
    | "unknown";
  confidence: number;
  title: string;
  area_name: string | null;
  project_name: string | null;
  due_date: string | null; // YYYY-MM-DD
  due_time: string | null; // HH:MM
  priority: number | null;
  contact_name: string | null;
  habit_name: string | null;
  metric_type: MetricType | null;
  value: number | null;
  unit: string | null;
  trip_name: string | null;
  notes: string | null;
}
