import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
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
export const userController = {
  createAdmin,
  registerUser,
  registerHost,
};
