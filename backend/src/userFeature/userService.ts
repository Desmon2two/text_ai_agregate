import userModel from "./userModel.js"


async function findByEmail(email){
    return await userModel.findByEmail(email);
};
async function findById(userId){
    return await userModel.findById(userId)
}
async function findByUsername(username){
    return await userModel.findByUsername(username)
}
async function deleteById(userId, context) {
	return await userModel.deleteById(userId, context);
}
async function createUser(email, password, username){
    const user = await userModel.createUser(email, password, username);
    return user
}
async function patchOne(userId, newData){
    const result = await userModel.patchUser(userId, newData);
    return result
}


export default {
	findByEmail,
    findByUsername,
	createUser,
	findById,
	deleteById,
	patchOne,
};