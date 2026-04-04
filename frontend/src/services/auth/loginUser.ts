"use server";

import { parse } from "cookie";
import { cookies } from "next/headers";
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
    let accessTokenObject: null | any = null;
    let refreshTokenObject: null | any = null;

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
    });

    const result = await res.json();

    // const setCookieHeaders = res.headers.getSetCookie();
    // if (setCookieHeaders && setCookieHeaders.length > 0) {
    //   setCookieHeaders.forEach((cookie: string) => {
    //     const parsedCookie = parse(cookie);
    //     console.log(parsedCookie, "Parsed cookie");
    //   });
    // } else {
    //   throw new Error("No Set-Cookie header found in the response");
    // }

    const setCookieHeaders = res.headers.getSetCookie();
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookie: string) => {
        const parsedCookie = parse(cookie);

        if (parsedCookie["accessToken"]) {
          accessTokenObject = parsedCookie;
        }
        if (parsedCookie["refreshToken"]) {
          refreshTokenObject = parsedCookie;
        }
      });
    } else {
      throw new Error("No Set-Cookie Headers found");
    }

    if (!accessTokenObject) {
      throw new Error("AccessToken not found in cookies");
    }
    if (!refreshTokenObject) {
      throw new Error("RefreshToken not found in cookies");
    }

    const storeCookie = await cookies();

    storeCookie.set("accessToken", accessTokenObject.accessToken, {
      secure: true,
      httpOnly: true,
      maxAge: parseInt(accessTokenObject.maxAge),
      path: accessTokenObject.Path || "/",
    });
    storeCookie.set("refreshToken", refreshTokenObject.refreshToken, {
      secure: true,
      httpOnly: true,
      maxAge: parseInt(refreshTokenObject.maxAge),
      path: refreshTokenObject.Path || "/",
    });

    return result;
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};
