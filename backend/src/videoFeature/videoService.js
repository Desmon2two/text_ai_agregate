import videoModel from "./videoModel.js";

async function create(videoData, userId) {
	const video = await videoModel.post(videoData, userId);
	return video;
}
async function get(videoId) {
	const video = await videoModel.get(videoId);
	return video;
}
async function getVideosByTitle(title) {
	const videos = await videoModel.getVideosByTitle(title);
	return videos;
}
async function getVideosByTitleWords(wordsArray) {
	const videos = await videoModel.getVideosByTitleWords(wordsArray);
	return videos;
}
async function getVideosByUserId(userId) {
	const videos = await videoModel.getVideosByUserId(userId);
	return videos;
}
async function showVideos(offset, limit) {
	const videos = await videoModel.getVideos(offset, limit);
	return videos;
}
async function countVideos() {
	const count = await videoModel.countVideos();
	return count;
}
async function deleteVideo(videoId) {
	const isDeleted = await videoModel.deleteVideo(videoId);
	return isDeleted;
}
async function deleteByUser(userId, context) {
	const isDeleted = await videoModel.deleteByUser(userId, context);
	return isDeleted;
}

export default {
	create,
	get,
	getVideosByTitle,
	getVideosByTitleWords,
	getVideosByUserId,
	showVideos,
	countVideos,
	deleteVideo,
	deleteByUser,
};
