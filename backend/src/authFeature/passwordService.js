import bcrypt from "bcrypt";

async function hashPassword(password){
const saltRounds = 12;
const hash = await bcrypt.hash(password, saltRounds);
return hash
};
function checkPassword(password, hash){
return bcrypt.compare(password, hash);
};

export default {
	hashPassword,
	checkPassword,
};