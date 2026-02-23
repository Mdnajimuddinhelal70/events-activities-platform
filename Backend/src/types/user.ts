import { UserRole, UserStatus } from "../../generated/prisma/enums";

export type SafeUser = {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
};
