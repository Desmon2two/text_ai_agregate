import userService from "../userFeature/userService.js";
import passwordService from "../authFeature/passwordService.js";
import authService from "../authFeature/authService.js";
import atomicTransaction from "../infrastructure/database/mongoDB/atomicTransaction.js";
import videoService from "../videoFeature/videoService.js";
import { NotFoundError } from "../errors/notFoundError.js";
import { ForbiddenError } from "../errors/forbiddenError.js";
import { UnauthorizedError } from "../errors/unauthorizedError.js";
import { ValidationError } from "../errors/validationError.js";
import userValidation from "../userFeature/userValidation.js";

async function registerUser(email, password, username) {
  userValidation.validateCredentialsPatch({ email, password });
  userValidation.validateUserPatch( username );
  const existsByEmail = await userService.findByEmail(email);
  const existsByUsername = await userService.findByUsername(username);
  if (existsByEmail || existsByUsername)
    throw new ForbiddenError("User already exists");
  const hashedPassword = await passwordService.hashPassword(password);
  const user = await userService.createUser(email, hashedPassword, username);
  const accessToken = await authService.generateAccessToken(user._id);
  return {
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
    },
    accessToken,
  };
}
async function loginUser(email, password) {
  await userValidation.validateCredentialsPatch({ email, password });
  const user = await userService.findByEmail(email);
  if (!user) throw new UnauthorizedError("Wrong email");
  const isPasswordCorrect = await passwordService.checkPassword(
    password,
    user.password,
  );
  if (!isPasswordCorrect) throw new UnauthorizedError("Wrong password");
  const accessToken = await authService.generateAccessToken(user._id);
  const refreshToken = await authService.generateRefreshToken(user._id);
  return {
    user: {
      id: user._id,
      email: user.email,
      username: user.userName,
      displayName: user.displayName,
      profilePic: user.profilePic,
      bio: user.bio,
    },
    accessToken,
    refreshToken,
  };
}
async function getCurrentUser(userId) {
  const user = await userService.findById(userId);
  if (!user) throw new NotFoundError("User not found");
  return {
    user: {
      id: user._id,
      email: user.email,
      profilePic: user.profilePic,
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
    },
  };
}
async function patchUserPassword(userId, currentPassword, newPassword) {
  await userValidation.validateCredentialsPatch(newPassword);
  const user = await userService.findById(userId);
  if (!user) throw new NotFoundError("User not found");
  const isCorrect = await passwordService.checkPassword(
    currentPassword,
    user.password,
  );
  const isNew = await passwordService.checkPassword(newPassword, user.password);
  if (!isCorrect) throw new UnauthorizedError("Wrong password");
  if (!isNew) throw new UnauthorizedError("Same password");
  const hash = await passwordService.hashPassword(newPassword);
  const hashedPassword = { password: hash };
  const patchedUser = await userService.patchOne(userId, hashedPassword);
  if (!patchedUser) throw new Error("Something went wrong, please try again");
  return;
}
async function patchUserEmail(userId, password, email) {
  await userValidation.validateCredentialsPatch({ email, password });
  const user = await userService.findById(userId);
  if (!user) throw new NotFoundError("User not found");
  const isCorrect = await passwordService.checkPassword(
    password,
    user.password,
  );
  if (!isCorrect) throw new UnauthorizedError("Wrong password");
  if (user.email === email) throw new UnauthorizedError("Email is the same");
  const existingUser = await userService.findByEmail(email);
  if (existingUser) throw new UnauthorizedError("Email already in use");
  const result = await userService.patchOne(userId, { email });
  if (!result) throw new Error("Something went wrong, please try again");
  return;
}
async function patchUser(userId, userData) {
  const {username, displayName, profilePic, bio} = userData;
  userValidation.validateUserPatch(username, displayName, profilePic, bio);
  const user = await userService.patchOne(userId, userData);
  if (!user) throw new NotFoundError("User not found");
  return {
    user: {
      username: user.username,
      displayName: user.displayName,
      profilePic: user.profilePic,
      bio: user.bio,
    },
  };
}
async function refreshToken(token) {
  const payload = await authService.verifyRefreshToken(token);
  const user = await userService.findById(payload.userId);
  if (!user) throw new UnauthorizedError("User does not exists");
  const accessToken = await authService.generateAccessToken(user.id);
  return { accessToken };
}
async function deleteUser(userId) {
  const user = await userService.findById(userId);
  if (user === null) throw new NotFoundError("User not found");
  return atomicTransaction.execute(async (context) => {
    await userService.deleteById(userId, context);
    await videoService.deleteByUser(userId, context);
  });
}

export default {
  registerUser,
  deleteUser,
  loginUser,
  refreshToken,
  getCurrentUser,
  patchUser,
  patchUserPassword,
  patchUserEmail,
};
