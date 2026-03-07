import httpStatus from "http-status";
import { EventStatus, UserStatus } from "../../../../generated/prisma/enums";
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

const getAllEvents = async () => {
  const events = await prisma.event.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      hostId: true,
    },
  });
  return events;
};

const updateEventStatus = async (id: string, status: EventStatus) => {
  const event = await prisma.event.findUnique({
    where: { id },
  });
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
  }

  return prisma.event.update({
    where: { id },
    data: { status },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      hostId: true,
    },
  });
};

const deleteEvent = async (id: string) => {
  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
  }

  await prisma.review.deleteMany({
    where: { eventId: id },
  });

  return prisma.event.delete({
    where: { id },
    select: {
      id: true,
      title: true,
      status: true,
    },
  });
};

const getAllHosts = async () => {
  return prisma.host.findMany({
    select: {
      id: true,
      fullName: true,
      profilePhoto: true,
      location: true,
      interests: true,
      contactNumber: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          email: true,
          status: true,
        },
      },
    },
  });
};

const updateHostStatus = async (id: string, status: UserStatus) => {
  const host = await prisma.host.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!host) {
    throw new ApiError(httpStatus.NOT_FOUND, "Host not found");
  }

  await prisma.user.update({
    where: { id: host.userId },
    data: { status },
  });

  return prisma.host.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      profilePhoto: true,
      location: true,
      interests: true,
      contactNumber: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          email: true,
          status: true,
        },
      },
    },
  });
};

export const AdminService = {
  getAllUsers,
  updateUserStatus,
  getAllEvents,
  updateEventStatus,
  deleteEvent,
  getAllHosts,
  updateHostStatus,
};
