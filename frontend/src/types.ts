export type Role = "EMPLOYEE" | "OWNER";

export type User = {
  id: number;
  userId: string;
  name: string;
  role: Role;
};

export type AttendanceRecord = {
  id: number;
  employeeId: number;
  action: AttendanceActionType;
  occurredAt: string;
};

export type AttendanceActionType =
  | "CLOCK_IN"
  | "CLOCK_OUT"
  | "BREAK_START"
  | "BREAK_END";

export type ConditionData = {
  health: number;
  motivation: number;
};

export type HealthRecordBody = {
  health: number;
  motivation: number;
};
