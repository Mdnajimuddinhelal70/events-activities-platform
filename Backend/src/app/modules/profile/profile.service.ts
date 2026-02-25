import { prisma } from "../../../lib/prisma";
import { ProfileInput } from "./profile.interface";

const createProfile = async (userId: string, data: ProfileInput) => {
  return prisma.profile.create({
    data: {
      ...data,
      userId,
    },
  });
};

const updateProfile = async (userId: string, data: Partial<ProfileInput>) => {
  return prisma.profile.update({
    where: { userId },
    data,
  });
};

const getProfile = async (userId: string) => {
  return prisma.profile.findUnique({
    where: { userId },
  });
};

const getPublicProfile = async (profileId: string) => {
  return prisma.profile.findUnique({
    where: { id: profileId },
  });
};

export const ProfileService = {
  createProfile,
  updateProfile,
  getProfile,
  getPublicProfile,
};
