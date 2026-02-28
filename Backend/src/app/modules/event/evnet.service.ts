import { prisma } from "../../../lib/prisma";

import httpStatus from "http-status";
import { EventParticipantStatus } from "../../../../generated/prisma/enums";
import { paginationHelper } from "../../../helpers/paginationHelper";
import ApiError from "../../errors/ApiError";
import { eventSearchableFields } from "./event.constants";

const getAllEvents = async (filters: any, options: any) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions: any[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: eventSearchableFields.map((field) => ({
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
        [key]: { equals: (filterData as any)[key] },
      })),
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.event.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
  });

  const total = await prisma.event.count({ where: whereConditions });

  return {
    meta: { total, page, limit },
    data: result,
  };
};

const joinEvent = async (userId: string, eventId: string) => {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
  }

  const existing = await prisma.eventParticipant.findUnique({
    where: {
      userId_eventId: { userId, eventId },
    },
  });
  if (existing) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Already joined this event");
  }

  const participant = await prisma.eventParticipant.create({
    data: {
      userId,
      eventId,
      status: EventParticipantStatus.JOINED,
    },
  });

  return participant;
};

export const eventService = {
  getAllEvents,
  joinEvent,
};
