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

// 目標設定リクエストの型
export type GoalSetBody = {
  targetAmount: number;
  description: string;
}

// 目標設定レスポンスの型
export type GoalSetResponse = {
    message: string;
};

// 進捗取得レスポンスの型
export type GoalProgressResponse = {
  target: { targetAmount: number, description: string, createdAt: string } | null;
  earnedAmount: number;
  progressPercent: number;
  neededAmount: number;
  isCompleted: boolean;
  message: string;
}

