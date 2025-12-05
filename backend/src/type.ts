import { AttendanceAction } from "@prisma/client";

export type AttendanceRecord = {
  id: number;
  employeeId: number;
  action: AttendanceAction;
  occurredAt: Date;
};

// ユーザー登録リクエストボディの型
export type AccountRegisterBody = {
  userId: string;
  name: string;
  password: string;
  role: "EMPLOYEE" | "OWNER";
};
