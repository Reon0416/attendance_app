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

export type GetHealthRecord = {
    id: number;
    employeeId: number;
    health: number;
    motivation: number;
    recordedAt: string;
};

// パスワード更新のリクエストボディ
export type PasswordUpdateBody = {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
};

// ユーザーID更新のリクエストボディ
export type UserIdUpdateBody = {
  currentPassword: string;
  newUserId: string;
};

export type LatestAttendanceRecord = {
    action: AttendanceActionType;
    occurredAt: string;
};