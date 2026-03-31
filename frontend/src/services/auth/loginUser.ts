"use server";

import z from "zod";

/* eslint-disable @typescript-eslint/no-explicit-any */

const userValidationZodSchema = z.object({
  email: z.email({
    error: "Please enter a valid email address",
  }),
  password: z.string({
    error: "Password is required",
  }),
});

export const loginUser = async (_currentState: any, formData: any) => {
  try {
    const loginData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    const validatedFields = userValidationZodSchema.safeParse(loginData);
    console.log(validatedFields);
    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.issues.map((issue) => {
          return {
            field: issue.path[0],
            message: issue.message,
          };
        }),
      };
    }

    const res = await fetch("http://localhost:5000/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(loginData),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
    return res;
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};
