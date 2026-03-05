import { isAfter, parseISO } from "date-fns";
import { z } from "zod";

const create = z.object({
  body: z.object({
    title: z.string({ error: "Title is required" }).min(1, "Title is required"),

    type: z.enum(
      ["CONCERT", "SPORTS", "HIKE", "DINNER", "OTHER", "TECH_MEETUP"],
      { error: "Type is required" },
    ),

    description: z.string().optional(),

    location: z
      .string({ error: "Location is required" })
      .min(1, "Location is required"),

    eventDate: z
      .string({ error: "Event date is required" })
      .refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
        message: "Invalid date format (must be YYYY-MM-DD)",
      })
      .transform((val) => parseISO(val))
      .refine(
        (date) => {
          const today = new Date();
          return (
            isAfter(date, today) || date.toDateString() === today.toDateString()
          );
        },
        {
          message: "Event date must be today or in the future",
        },
      ),

    joiningFee: z
      .number({ error: "Joining fee is required" })
      .min(0, "Joining fee must be positive"),

    minParticipants: z
      .number({ error: "Minimum participants is required" })
      .min(1, "Minimum participants must be at least 1"),

    maxParticipants: z
      .number({ error: "Maximum participants is required" })
      .min(1, "Maximum participants must be at least 1"),
  }),
});

export const EventValidation = {
  create,
};
