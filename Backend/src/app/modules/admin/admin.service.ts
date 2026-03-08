import httpStatus from "http-status";
import { EventStatus, UserStatus } from "../../../../generated/prisma/enums";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { prisma } from "../../../lib/prisma";
import ApiError from "../../errors/ApiError";
import { userSearchableFields } from "./userFilterableFields";

const getAllUsers = async (filters: any, options: any) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions: any[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: { equals: filterData[key] },
      })),
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const total = await prisma.user.count({ where: whereConditions });

  return {
    meta: { total, page, limit },
    data: result,
  };
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
