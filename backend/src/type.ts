import { AttendanceAction } from "@prisma/client";

export type AttendanceRecord = {
  id: number;
  employeeId: number;
  action: AttendanceAction;
  occurredAt: Date;
};

