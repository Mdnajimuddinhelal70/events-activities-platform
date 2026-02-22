import bcrypt from "bcrypt";
import { Admin, UserRole } from "../../../../generated/prisma/client";
import config from "../../../config";
import { prisma } from "../../../lib/prisma";

const createAdmin = async (payload: any): Promise<Admin> => {
  const hashedPassword: string = await bcrypt.hash(
    payload.password,
    Number(config.salt_round),
  );

  const userData = {
    email: payload.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (tnx) => {
    // ✅ create user first
    const createdUser = await tnx.user.create({
      data: userData,
    });

    // ✅ attach userId to admin
    const createdAdminData = await tnx.admin.create({
      data: {
        ...payload.admin,
        userId: createdUser.id,
      },
    });

    return createdAdminData;
  });

  return result;
};
export const userService = {
  createAdmin,
};
