import express, { NextFunction, Request, Response } from "express";
import { UserRole } from "../../../../generated/prisma/enums";
import { fileUploader } from "../../../helpers/fileUploader";
import auth from "../../middlewares/auth";
import { userController } from "./user.controller";
import { userValidation } from "./user.validation";

const router = express.Router();

router.get("/get-all", userController.getAllFromDB);
router.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.HOST, UserRole.USER),
  userController.getMyProfile,
);

router.post(
  "/create-admin",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    const parsedData = JSON.parse(req.body.data);
    req.body = userValidation.createAdmin.parse({ body: parsedData }).body;
    return userController.createAdmin(req, res, next);
  },
);

router.post(
  "/create-user",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    const parsedData = JSON.parse(req.body.data);
    req.body = userValidation.createUser.parse({ body: parsedData }).body;
    return userController.createUser(req, res, next);
  },
);
router.post(
  "/create-host",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    const parsedData = JSON.parse(req.body.data);
    req.body = userValidation.createHost.parse({ body: parsedData }).body;
    return userController.createHost(req, res, next);
  },
);

router.patch("/:id/status", userController.changeProfileStatus);
router.patch("/update-my-profile", userController.updateMyProfile);

export const UserRoute = router;
