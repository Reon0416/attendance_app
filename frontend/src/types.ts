export type Role = "EMPLOYEE" | "OWNER";

export type User = {
  id: number;
  userId: string;
  name: string;
  role: Role;
};
