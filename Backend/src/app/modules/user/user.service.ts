import bcrypt from "bcrypt";
import { Request } from "express";
import httpStatus from "http-status";
import { UserRole, UserStatus } from "../../../../generated/prisma/client";
import config from "../../../config";
import { fileUploader } from "../../../helpers/fileUploader";
import { prisma } from "../../../lib/prisma";
import ApiError from "../../errors/ApiError";
import { IAuthUser } from "../../interfaces/common";

const createAdmin = async (req: Request) => {
  const file = req.file;

  if (file) {
    const uploadResult = await fileUploader.uploadToCloudinary(file);
    req.body.admin.profilePhoto = uploadResult?.secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(
    req.body.password,
    Number(config.salt_round),
  );

  const userData = {
    email: req.body.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (tnx) => {
    const createdUser = await tnx.user.create({
      data: userData,
    });

    const createdAdminData = await tnx.admin.create({
      data: {
        ...req.body.admin,
        userId: createdUser.id,
      },
    });

    return createdAdminData;
  });

  return result;
};

const createUser = async (req: Request) => {
  const file = req.file;

  if (file) {
    const uploadResult = await fileUploader.uploadToCloudinary(file);
    req.body.user.profilePhoto = uploadResult?.secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(
    req.body.password,
    Number(config.salt_round),
  );

  const userData = {
    email: req.body.email,
    password: hashedPassword,
    role: UserRole.USER,
  };

  const result = await prisma.$transaction(async (tnx) => {
    const createdUser = await tnx.user.create({
      data: userData,
    });

    const createdUserData = await tnx.profile.create({
      data: {
        ...req.body.user,
        userId: createdUser.id,
      },
    });

    return createdUserData;
  });

  return result;
};

const createHost = async (req: Request) => {
  const file = req.file;
  if (file) {
    const uploadResult = await fileUploader.uploadToCloudinary(file);
    req.body.host.profilePhoto = uploadResult?.secure_url;
  }
  const hashedPassword = await bcrypt.hash(
    req.body.password,
    Number(config.salt_round),
  );

  const userData = {
    email: req.body.email,
    password: hashedPassword,
    role: UserRole.HOST,
  };

  const hostUser = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: userData,
    });

    const createdHost = await tx.host.create({
      data: {
        ...req.body.host,
        userId: createdUser.id,
      },
    });

    return createdHost;
  });

  return hostUser;
};

// const getAllFromDB = async (): Promise<IAuthUser[]> => {
//   return prisma.user.findMany({
//     where: { role: UserRole.USER },
//     select: {
//       id: true,
//       email: true,
//       role: true,
//       status: true,
//       createdAt: true,
//       updatedAt: true,
//     },
//   });
// };

const getAllFromDB = async (role?: string) => {
  if (role === UserRole.ADMIN) {
    return await prisma.admin.findMany({
      where: { isDeleted: false },
      include: { user: true },
    });
  }

  if (role === UserRole.HOST) {
    return await prisma.host.findMany({
      include: { user: true, events: true },
    });
  }

  // Default → Normal Users
  return await prisma.user.findMany({
    where: { role: UserRole.USER },
    include: { profile: true },
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
  const result = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      admin: true,
      host: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const { password, ...safeData } = result;
  return safeData;
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
