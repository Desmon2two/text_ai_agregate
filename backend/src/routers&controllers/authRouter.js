import express from "express";
import authController from "./authController.js";
import { authenticate } from "../middlewears/authMiddleware.js";
const router = express.Router();
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);
router.post("/refresh", authController.refreshAccessToken);
router.delete("/users/me", authenticate, authController.deleteUser);
router.get("/users/me", authenticate, authController.getCurrentUser);
// router.patch("/users/me", authenticate, authController.patchUser)
router.patch("/users/me/password", authenticate, authController.patchUserPassword);
router.patch("/users/me/email", authenticate, authController.patchUserEmail);
router.get("/users/me/credits", authenticate, authController.getCreditsOfCurrentUser);
router.get("/users/me/finances", authenticate, authController.getFinHistoryOfUser);
router.get("/users/me/jobs", authenticate, authController.getAllJobsOfUser);
export default router;
