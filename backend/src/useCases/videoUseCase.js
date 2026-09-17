import userService from "../userFeature/userService.js";
import { validateVideoId } from "../infrastructure/database/mongoDB/validateId.js";
import videoService from "../videoFeature/videoService.js";
import { NotFoundError } from "../errors/notFoundError.js";
import { ValidationError } from "../errors/validationError.js";
import { ForbiddenError } from "../errors/forbiddenError.js";
import mapVideo from "../infrastructure/utils/videoMapper.js";
import validateVideoData from "../videoFeature/validateVideoData.js";

async function createVideo(videoData, userId) {
	const user = await userService.findById(userId);
	if (!user) throw new NotFoundError("User not found");
	validateVideoData(videoData)
	const result = await videoService.create(videoData, userId);
	const video = mapVideo(result)
	return video;
}
async function getVideo(videoId) {
	const isValid = validateVideoId(videoId);
	if (!isValid) throw new ValidationError("Wrong video id");
	const result = await videoService.get(videoId);
	if (!result) throw new NotFoundError("Requested video does not exist");
	const video = mapVideo(result)
	return video;
}
async function searchVideos(title) {
	if (typeof title !== "string") return {videos:[]}
	const clearedTite = title.trim().replace(/\s+/g, " ")
	if (clearedTite === "") return {videos:[]}
	const videos = await videoService.getVideosByTitle(clearedTite);
	if (videos.length === 0) {
		const splittedTitle = clearedTite.split(" ")
		const videosByTitleWords = await videoService.getVideosByTitleWords(splittedTitle)
		return {videos: videosByTitleWords.map(mapVideo)};
	};
	return {videos: videos.map(mapVideo)};
}
async function getVideosByUser(userId) {
	const user = await userService.findById(userId)
	if (!user) throw new NotFoundError("User not found");
	const videos = await videoService.getVideosByUserId(user.id);
	return {videos: videos.map(mapVideo)};
}
async function deleteVideo(videoId, userId) {
	const isValid = validateVideoId(videoId);
	if (!isValid) throw new ValidationError("Wrong video id");
	const video = await videoService.get(videoId);
	if (!video) throw new NotFoundError("Requested video does not exist");
	if (userId !== video.creatorId.toString())
		throw new ForbiddenError("This user cannot delete this video");
	const result = await videoService.deleteVideo(videoId);
	if (result.deletedCount === 0)
		throw new NotFoundError("The video was not deleted");
	return result.acknowledged;
}
async function showVideos(page, limit) {
	if (page === undefined) page = 1;
	if (limit === undefined) limit = 20;
	page = Number(page);
	limit = Number(limit);
	if (!Number.isInteger(page) || !Number.isInteger(limit))
		throw new ValidationError("Invalid request");
	if (page < 1 || limit < 1 || limit > 100)
		throw new ValidationError("Invalid request");
	const offset = (page - 1) * limit;
	const [videos, totalVideos] = await Promise.all([
		videoService.showVideos(offset, limit),
		videoService.countVideos(),
	]);
	const totalPages = Math.ceil(totalVideos / limit);
	const result = {
		videos: videos.map(mapVideo),
		pagination: {
			page,
			limit,
			totalVideos,
			totalPages,
		},
	};
	return result;
}

export default {
	createVideo,
	getVideo,
	getVideosByUser,
	searchVideos,
	showVideos,
	deleteVideo,
};
