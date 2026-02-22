import z, { email } from "zod";

const createAdmin = z.object({
  password: z.string({
    error: "Password is required",
  }),
  admin: z.object({
    name: z.string({
      error: "Admin name is required",
    }),
    email: email({
      error: "Admin email is required",
    }),
    contactNo: z.string({
      error: "Admin contact number is required",
    }),
  }),
});

export const userValidation = {
  createAdmin,
};
