import { Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../../config";
import { convertToMs } from "../../../helpers/convertToMs";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthService } from "./auth.service";

// LOGIN
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const accessTokenMaxAge = convertToMs(config.jwt.expires_in as string);

  const refreshTokenMaxAge = convertToMs(
    config.jwt.refresh_token_expires_in as string,
  );

  const result = await AuthService.loginUser(req.body);
  const { refreshToken, accessToken } = result;

  res.cookie("accessToken", accessToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: accessTokenMaxAge,
  });

  res.cookie("refreshToken", refreshToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: refreshTokenMaxAge,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged in successfully!",
    data: {
      needPasswordChange: result.needPasswordChange,
    },
  });
});

// REFRESH TOKEN
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const accessTokenMaxAge = convertToMs(config.jwt.expires_in as string);

  const refreshTokenMaxAge = convertToMs(
    config.jwt.refresh_token_expires_in as string,
  );

  const result = await AuthService.refreshToken(refreshToken);

  res.cookie("accessToken", result.accessToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: accessTokenMaxAge,
  });

  res.cookie("refreshToken", result.refreshToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: refreshTokenMaxAge,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token generated successfully!",
    data: {
      message: "Access token generated successfully!",
    },
  });
});

// CHANGE PASSWORD
const changePassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;

    const result = await AuthService.changePassword(user, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password Changed successfully",
      data: result,
    });
  },
);

// RESET PASSWORD
const resetPassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.replace("Bearer ", "") : null;
    const user = req.user;

    await AuthService.resetPassword(token, req.body, user);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password Reset!",
      data: null,
    });
  },
);

// GET ME IMPORTANT FIX
const getMe = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    // BEST PRACTICE: use req.user (not cookies)
    const user = req.user;

    const result = await AuthService.getMe(user);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User retrieved successfully",
      data: result,
    });
  },
);

export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
  resetPassword,
  getMe,
};
