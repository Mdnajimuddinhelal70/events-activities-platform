import { UserRole } from "../../../generated/prisma/enums";

export type IAuthUser = {
  id: string;
  email: string;
  role: UserRole;
};
