import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";

import ApiError from "../../errors/ApiError";
import { IAuthUser } from "../../interfaces/common";
import { userService } from "./user.service";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createAdmin(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin Created successfuly!",
    data: result,
  });
});

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createUser(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const registerHost = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createHost(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Host registered successfully",
    data: result,
  });
});

// 1️⃣ Get all users
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getAllFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All users fetched successfully",
    data: result,
  });
});

// 2️⃣ Change User Status
const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const { userId, status } = req.body;
  const result = await userService.changeProfileStatus(userId, status);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User status updated successfully",
    data: result,
  });
});

// 3️⃣ Get My Profile
const getMyProfile = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;

    if (!user || !user.id) {
      return sendResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: "User not authenticated",
        data: null,
      });
    }

    const result = await userService.getMyProfile(user.id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Profile fetched successfully",
      data: result,
    });
  },
);
// 4️⃣ Update My Profile
// const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
//   const userId = req.user!.id;
//   const payload = req.body;
//   const result = await userService.updateMyProfile(userId, payload);
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Profile updated successfully",
//     data: result,
//   });
// });

const updateMyProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
    }

    const result = await userService.updateMyProfile(req.user, req);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My profile updated!",
      data: result,
    });
  },
);

export const userController = {
  createAdmin,
  registerUser,
  registerHost,
  getAllFromDB,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile,
};
