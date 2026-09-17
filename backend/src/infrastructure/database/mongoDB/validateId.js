import mongoose from "mongoose";

function validateVideoId(id) {
	return mongoose.Types.ObjectId.isValid(id);
}
export { validateVideoId };
