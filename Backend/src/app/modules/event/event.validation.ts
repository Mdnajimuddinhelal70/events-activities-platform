import { z } from "zod";
import { EventType } from "../../../../generated/prisma/enums";

const eventQuerySchema = z.object({
  query: z.object({
    searchTerm: z.string().optional(),
    type: z
      .enum([
        EventType.CONCERT,
        EventType.SPORTS,
        EventType.HIKE,
        EventType.DINNER,
        EventType.OTHER,
        EventType.TECH_MEETUP,
      ])
      .optional(),
    location: z.string().optional(),
    eventDate: z.string().optional(),
    page: z.string().transform(Number).optional(),
    limit: z.string().transform(Number).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});

export const EventValidation = {
  eventQuery: eventQuerySchema,
};
