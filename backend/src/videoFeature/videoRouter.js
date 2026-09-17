import express from "express";
import authenticate from "../middlewears/authMiddleware.js";
import videoController from "./videoController.js";
const router = express.Router();

router.get("/", videoController.showVideos);
router.get("/byUser/:userId", videoController.getVideosByUser);
router.get("/search", videoController.searchVideos);
router.get("/:videoId", videoController.getVideo);
router.delete("/:videoId", authenticate, videoController.deleteVideo);

router.post("/", authenticate, videoController.postVideo);

export default router;
