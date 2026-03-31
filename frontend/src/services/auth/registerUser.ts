/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import z from "zod";
const userRegisterValidationZodSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
  user: z.object({
    fullName: z.string().min(1, "Full name is required"),
    contactNumber: z.string().optional(),
  }),
});

export const registerUser = async (_: any, formData: FormData) => {
  try {
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      return {
        success: false,
        errors: [
          { field: "confirmPassword", message: "Passwords do not match" },
        ],
      };
    }

    const registerData = {
      email: formData.get("email"),
      password,
      confirmPassword,
      user: {
        fullName: formData.get("fullName"),
        contactNumber: formData.get("contactNumber"),
      },
    };

    const validatedFields =
      userRegisterValidationZodSchema.safeParse(registerData);

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.issues.map((issue) => ({
          field: issue.path[issue.path.length - 1],
          message: issue.message,
        })),
      };
    }

    const newFormData = new FormData();

    const { confirmPassword: _, ...dataToSend } = registerData;

    newFormData.append("data", JSON.stringify(dataToSend));

    // optional file
    // const file = formData.get("profilePhoto");
    // if (file && typeof file !== "string") {
    //   newFormData.append("file", file);
    // }

    const res = await fetch("http://localhost:5000/api/v1/user/create-user", {
      method: "POST",
      body: newFormData,
    });

    return await res.json();
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};
