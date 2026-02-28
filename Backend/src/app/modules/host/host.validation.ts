import { z } from "zod";
import { EventType } from "../../../../generated/prisma/enums";

const create = z.object({
  body: z.object({
    title: z.string({ error: "Title is required" }),
    type: z.enum(
      [
        EventType.CONCERT,
        EventType.SPORTS,
        EventType.HIKE,
        EventType.DINNER,
        EventType.OTHER,
        EventType.TECH_MEETUP,
      ],
      {
        error: "Type is required",
      },
    ),
    description: z.string().optional(),
    location: z.string({ error: "Location is required" }),
    eventDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
    joiningFee: z.number().min(0, "Joining fee must be positive"),
    minParticipants: z
      .number()
      .min(1, "Minimum participants must be at least 1"),
    maxParticipants: z
      .number()
      .min(1, "Maximum participants must be at least 1"),
  }),
});

export const EventValidation = {
  create,
};
