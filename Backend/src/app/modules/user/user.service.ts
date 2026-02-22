import bcrypt from "bcrypt";
import {
  Admin,
  Host,
  User,
  UserRole,
} from "../../../../generated/prisma/client";
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

const createUser = async (payload: any): Promise<User> => {
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.salt_round),
  );

  const user = await prisma.user.create({
    data: {
      email: payload.email,
      password: hashedPassword,
      role: UserRole.USER,
    },
  });

  return user;
};

const createHost = async (payload: any): Promise<Host> => {
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.salt_round),
  );

  const hostUser = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        role: UserRole.HOST,
      },
    });

    const createdHost = await tx.host.create({
      data: {
        ...payload.host,
        userId: createdUser.id,
      },
    });

    return createdHost;
  });

  return hostUser;
};

export const userService = {
  createAdmin,
  createUser,
  createHost,
};
