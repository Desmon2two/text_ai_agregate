import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
  },
  bio: {
    type: String,
  },
});
const User = mongoose.model("User", userSchema);

async function findByEmail(email) {
  const user = await User.findOne({
    email,
  });
  return user || null;
}
async function findByUsername(username) {
  const user = await User.findOne({
    username,
  });
  return user || null;
}

async function findById(userId) {
  const user = await User.findOne({
    _id: userId,
  });
  return user || null;
}
async function deleteById(userId, context) {
  const options = context ? { session: context.session } : {};
  return User.deleteOne(
    {
      _id: userId,
    },
    options,
  );
}
function createUser(email, password, username) {
  return User.create({
    email,
    password,
    username,
  });
}
function patchUser(userId, newData) {
  return User.findOneAndUpdate(
    { _id: userId },
    { $set: newData },
    { new: true },
  );
}

export default {
  findByEmail,
  findByUsername,
  findById,
  createUser,
  deleteById,
  patchUser,
};
