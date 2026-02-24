import express from "express";
import { apiLimiter } from "../middlewares/rateLimiter";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoute } from "../modules/user/user.route";

const router = express.Router();

router.use(apiLimiter);

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoute,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
