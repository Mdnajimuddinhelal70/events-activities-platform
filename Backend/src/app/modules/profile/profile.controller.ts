import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ProfileService } from "./profile.service";

const createProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new Error("User ID is required to create profile");
  }

  const result = await ProfileService.createProfile(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Profile created successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new Error("User ID is required to create profile");
  }
  const result = await ProfileService.updateProfile(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

const getProfile = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new Error("User ID is required to create profile");
  }
  const result = await ProfileService.getProfile(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile fetched successfully",
    data: result,
  });
});

const getPublicProfile = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new Error("Profile ID is required to fetch public profile");
  }
  const result = await ProfileService.getPublicProfile(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Public profile fetched successfully",
    data: result,
  });
});

export const ProfileController = {
  createProfile,
  updateProfile,
  getProfile,
  getPublicProfile,
};
