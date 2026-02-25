import { prisma } from "../../../lib/prisma";

import httpStatus from "http-status";
import { EventParticipantStatus } from "../../../../generated/prisma/enums";
import ApiError from "../../errors/ApiError";

const getAllEvents = async () => {
  const events = await prisma.event.findMany({
    include: {
      host: true,
    },
  });
  return events;
};

const joinEvent = async (userId: string, eventId: string) => {
  // আগে চেক করো event আছে কিনা
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
  }

  // আগে চেক করো user আগেই join করেছে কিনা
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
