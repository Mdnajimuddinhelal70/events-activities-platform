import bcrypt from "bcrypt";
import { Request } from "express";
import httpStatus from "http-status";
import {
  Admin,
  Host,
  User,
  UserRole,
  UserStatus,
} from "../../../../generated/prisma/client";
import config from "../../../config";
import { prisma } from "../../../lib/prisma";
import { SafeUser } from "../../../types/user";
import ApiError from "../../errors/ApiError";
import { IAuthUser } from "../../interfaces/common";

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

const getAllFromDB = async (): Promise<SafeUser[]> => {
  return prisma.user.findMany({
    where: { role: UserRole.USER },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const changeProfileStatus = async (
  userId: string,
  status: "ACTIVE" | "INACTIVE" | "BANNED",
) => {
  return prisma.user.update({
    where: { id: userId },
    data: { status },
  });
};

const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      host: true,
      admin: true,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

const updateMyProfile = async (user: IAuthUser, req: Request) => {
  const userInfo = await prisma.user.findFirstOrThrow({
    where: {
      email: user!.email,
      status: UserStatus.ACTIVE,
    },
    include: {
      admin: true,
      host: true,
    },
  });

  let profileInfo;

  if (userInfo.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.update({
      where: { userId: userInfo.id },
      data: req.body,
    });
  } else if (userInfo.role === UserRole.HOST) {
    profileInfo = await prisma.host.update({
      where: { userId: userInfo.id },
      data: req.body,
    });
  } else if (userInfo.role === UserRole.USER) {
    profileInfo = await prisma.user.update({
      where: { id: userInfo.id },
      data: req.body,
    });
  }

  return { ...profileInfo };
};

export const userService = {
  createAdmin,
  createUser,
  createHost,
  getAllFromDB,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile,
};
