async function createJob(dbClient, job){
    await dbClient.query(`INSERT INTO jobs(body, files, job_type_id) VALUES ("${job.body}", "${job.job.files}", "${job.jobTypeId}")`)
}
async function markAccepted(dbClient, jobId){}
async function markQueued(dbClient, jobId){}
async function markProcessing(dbClient, jobId){}
async function markComplete(dbClient, jobId, data){}
async function markFailed(dbClient, jobId, error){}
export default {
}