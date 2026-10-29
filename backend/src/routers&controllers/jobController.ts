import jobService from "../jobFeature/jobService";
import jobUseCase from "../jobFeature/jobUseCase";
import { dbClient } from "../server.js";

async function addJob(req, res, next) {
  try {
    const {user_id} = req.user;
    const { provider, model, job_type, body, files } = req.body;
    const result = await jobUseCase.startJob(dbClient, user_id, provider, model, job_type, body, files)
    res.status(200).send(JSON.stringify(result));
  } catch (error) {
    next(error);
  }
}
async function getJob(req, res, next) {
  try {
    const { job_id } = req.body;
    const result = await jobService.getJob(dbClient, job_id)
    res.status(200).send(JSON.stringify(result));
  } catch (error) {
    next(error);
  }
}

export default {
    addJob,
    getJob,
}