import httpStatus from "http-status";
import { UserStatus } from "../../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";
import ApiError from "../../errors/ApiError";

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return users;
};

const updateUserStatus = async (id: string, status: UserStatus) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return prisma.user.update({
    where: { id },
    data: { status },
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

export const AdminService = {
  getAllUsers,
  updateUserStatus,
};
