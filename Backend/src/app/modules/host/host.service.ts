import { EventStatus } from "../../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";

const createEvent = async (userId: string, data: any) => {
  const host = await prisma.host.findUnique({
    where: { userId },
  });

  if (!host) {
    throw new Error("Host not found for this user");
  }

  return prisma.event.create({
    data: {
      title: data.title,
      type: data.type,
      description: data.description,
      location: data.location,
      image: data.image,
      eventDate: data.eventDate,
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
  // প্রথমে Host বের করো User এর সাথে লিঙ্ক করে
  const host = await prisma.host.findUnique({
    where: { userId },
  });

  if (!host) {
    throw new Error("Host not found for this user");
  }

  // Event খুঁজে বের করো
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event || event.hostId !== host.id) {
    throw new Error("Event not found or you are not authorized to update");
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
    throw new Error("Host not found for this user");
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
