import videoUseCase from "../useCases/videoUseCase.js";

async function postVideo(req, res, next) {
  try {
    const { userId } = req.user;
    const { title, description, year, coverURL } = req.body;
    const result = await videoUseCase.createVideo(
      { title, description, year, coverURL },
      userId,
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
async function getVideo(req, res, next) {
  try {
    const { videoId } = req.params;
    const result = await videoUseCase.getVideo(videoId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
async function searchVideos(req, res, next) {
  try {
    const { q } = req.query;
    const result = await videoUseCase.searchVideos(q);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
async function getVideosByUser(req, res, next) {
  try {
    const { userId } = req.params;
    const result = await videoUseCase.getVideosByUser(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
async function deleteVideo(req, res, next) {
  try {
    const { videoId } = req.params;
    const { userId } = req.user;
    await videoUseCase.deleteVideo(videoId, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
async function showVideos(req, res, next) {
  try {
    const { page, limit } = req.query;
    const result = await videoUseCase.showVideos(page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export default {
  searchVideos,
  getVideosByUser,
  postVideo,
  getVideo,
  showVideos,
  deleteVideo,
};
