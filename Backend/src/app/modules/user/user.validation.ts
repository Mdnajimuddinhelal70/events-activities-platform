import z from "zod";

const createUserSchema = z.object({
  body: z.object({
    email: z.string().email("Valid email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["USER", "HOST", "ADMIN"]).optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
    needPasswordChange: z.boolean().optional(),
  }),
});

const createHostSchema = z.object({
  body: z.object({
    fullName: z.string({ error: "Full name is required" }),
    profilePhoto: z.string().url().optional(),
    contactNumber: z.string().optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
    interests: z.array(z.string()).optional(),
    userId: z.string({ error: "User ID is required" }),
  }),
});

const createAdminSchema = z.object({
  body: z.object({
    fullName: z.string({ error: "Full name is required" }),
    profilePhoto: z.string().url().optional(),
    contactNumber: z.string().optional(),
    isDeleted: z.boolean().optional(),
    userId: z.string({ error: "User ID is required" }),
  }),
});

export const userValidation = {
  createUser: createUserSchema,
  createHost: createHostSchema,
  createAdmin: createAdminSchema,
};
