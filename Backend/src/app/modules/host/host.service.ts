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
const updateEvent = async (eventId: string, hostId: string, data: any) => {
  return prisma.event.updateMany({
    where: { id: eventId, hostId },
    data,
  });
};

// Delete Event
const deleteEvent = async (eventId: string, hostId: string) => {
  return prisma.event.deleteMany({
    where: { id: eventId, hostId },
  });
};

// Get Host's Events
const getMyEvents = async (hostId: string) => {
  return prisma.event.findMany({
    where: { hostId },
    include: { participants: true },
  });
};

// Get Participants of an Event
const getEventParticipants = async (eventId: string, hostId: string) => {
  return prisma.event.findFirst({
    where: { id: eventId, hostId },
    include: { participants: { include: { user: true } } },
  });
};

export const HostService = {
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  getEventParticipants,
};
