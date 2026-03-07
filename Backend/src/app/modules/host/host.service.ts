import { isAfter } from "date-fns";

import httpStatus from "http-status";
import { EventStatus } from "../../../../generated/prisma/enums";
import { fileUploader } from "../../../helpers/fileUploader";
import { prisma } from "../../../lib/prisma";
import ApiError from "../../errors/ApiError";

const createEvent = async (userId: string, data: any) => {
  const host = await prisma.host.findUnique({ where: { userId } });
  if (!host) {
    throw new Error("Host not found for this user");
  }
  const eventDate = data.eventDate;

  if (
    !isAfter(eventDate, new Date()) &&
    eventDate.toDateString() !== new Date().toDateString()
  ) {
    throw new Error("Event date must be today or in the future");
  }

  const existingEvent = await prisma.event.findFirst({
    where: {
      title: data.title,
      eventDate,
      location: data.location,
      hostId: host.id,
    },
  });
  if (existingEvent) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "An event with the same title, date, location and host already exists",
    );
  }
  return prisma.event.create({
    data: {
      title: data.title,
      type: data.type,
      description: data.description,
      location: data.location,
      image: data.image,
      eventDate,
      joiningFee: data.joiningFee || 0,
      minParticipants: data.minParticipants,
      maxParticipants: data.maxParticipants,
      status: EventStatus.OPEN,
      hostId: host.id,
    },
  });
};

// Update Event

const updateEvent = async (eventId: string, userId: string, data: any) => {
  const host = await prisma.host.findUnique({
    where: { userId },
  });

  if (!host) {
    throw new Error("Host not found for this user");
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event || event.hostId !== host.id) {
    throw new Error("Event not found or you are not authorized to update");
  }

  // old image delete
  if (data.image && event.image) {
    await fileUploader.deleteFromCloudinary(event.image);
  }

  return prisma.event.update({
    where: { id: eventId },
    data: {
      ...data,
    },
  });
};
// Delete Event
const deleteEvent = async (eventId: string, userId: string) => {
  const host = await prisma.host.findUnique({
    where: { userId },
  });

  if (!host) {
    throw new Error("Host not found for this user");
  }
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event || event.hostId !== host.id) {
    throw new Error("Event not found or you are not authorized to delete");
  }
  return prisma.event.delete({
    where: { id: eventId },
  });
};

// Get Host's Events
const getMyEvents = async (userId: string) => {
  const host = await prisma.host.findUnique({
    where: { userId },
  });

  if (!host) {
    throw new Error("Host not found for this user");
  }
  return prisma.event.findMany({
    where: { hostId: host.id },
    orderBy: { createdAt: "desc" },
  });
};

// Get Participants of an Event
const getEventParticipants = async (eventId: string, userId: string) => {
  const host = await prisma.host.findUnique({
    where: { userId },
  });

  if (!host) {
    throw new ApiError(httpStatus.NOT_FOUND, "Host not found for this user");
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event || event.hostId !== host.id) {
    throw new Error(
      "Event not found or you are not authorized to view participants",
    );
  }
  return prisma.eventParticipant.findMany({
    where: { eventId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          host: {
            select: {
              fullName: true,
              profilePhoto: true,
            },
          },
        },
      },
    },
  });
};

export const HostService = {
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  getEventParticipants,
};
