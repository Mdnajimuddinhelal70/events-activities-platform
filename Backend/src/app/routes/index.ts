import express from "express";
import { apiLimiter } from "../middlewares/rateLimiter";
import { UserRoute } from "../modules/user/user.route";

const router = express.Router();

router.use(apiLimiter); // Apply to all routes

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
