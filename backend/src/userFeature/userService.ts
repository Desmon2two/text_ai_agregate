import passwordService from "../authFeature/passwordService.js";
import authService from "../authFeature/authService.js";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/applicationErrors.js";
import { validateUserCredentials, validateUserDisplayedInfo } from "./js";
import userRepository from "./userRepository.js";
import type { User } from "./types/userType.js";

async function registerUser(
  dbClient: Client,
  email: string,
  password: string,
  username: string,
): Promise<{ user: User; accessToken: string }> {
  validateUserCredentials(email, password);
  validateUserDisplayedInfo(username);
  const existsByEmail = await userRepository.getUserByEmail(dbClient, email);
  const existsByUsername = await userRepository.getUserById(dbClient, username);
  if (existsByEmail || existsByUsername)
    throw new ForbiddenError("User already exists");
  const hashedPassword = await passwordService.hashPassword(password);
  const user = await userRepository.createUser(
    dbClient,
    username,
    email,
    hashedPassword,
  );
  if (!user) throw new Error("User was not created");
  const accessToken = authService.generateAccessToken(user.user_id);
  return { user, accessToken };
}
async function loginUser(
  dbClient: Client,
  email: string,
  inputPassword: string,
): Promise<{ user_id: string; accessToken: string; refreshToken: string }> {
  validateUserCredentials(email, inputPassword);
  const user = await userRepository.getUserByEmail(dbClient, email);
  if (!user) throw new UnauthorizedError("wrong email");
  const isPasswordCorrect = await passwordService.checkPassword(
    inputPassword,
    user.password,
  );
  if (!isPasswordCorrect) throw new UnauthorizedError("Wrong password");
  const accessToken = authService.generateAccessToken(user.user_id);
  const refreshToken = authService.generateRefreshToken(user.user_id);
  return {
    user_id: user.user_id,
    accessToken,
    refreshToken,
  };
}
async function patchUserPassword(
  dbClient: Client,
  user_id: string,
  currentPassword: string,
  newPassword: string,
) {
  validateUserCredentials(null, newPassword);
  const user = await userRepository.getUserById(dbClient, user_id);
  if (!user) throw new NotFoundError("User not found");
  const isCorrect = await passwordService.checkPassword(
    currentPassword,
    user.password,
  );
  const isNew = await passwordService.checkPassword(newPassword, user.password);
  if (!isCorrect) throw new UnauthorizedError("Wrong password");
  if (!isNew) throw new UnauthorizedError("Same password");
  const hash = await passwordService.hashPassword(newPassword);
  const patchedUser = await userRepository.changeUserPassword(
    dbClient,
    user_id,
    hash,
  );
  if (!patchedUser) throw new Error("Something went wrong, please try again");
  return;
}
async function patchUserEmail(
  dbClient: Client,
  user_id: string,
  password: string,
  email: string,
) {
  await validateUserCredentials(email, password);
  const user = await userRepository.getUserById(dbClient, user_id);
  if (!user) throw new NotFoundError("User not found");
  const isCorrect = await passwordService.checkPassword(
    password,
    user.password,
  );
  if (!isCorrect) throw new UnauthorizedError("Wrong password");
  if (user.email === email) throw new UnauthorizedError("Email is the same");
  const existingUser = await userRepository.getUserByEmail(dbClient, email);
  if (existingUser) throw new UnauthorizedError("Email already in use");
  const result = await userRepository.changeUserEmail(
    dbClient,
    user.user_id,
    email,
  );
  if (!result) throw new Error("Something went wrong, please try again");
  return;
}
async function refreshToken(dbClient: Client, token: string) {
  const payload = authService.verifyRefreshToken(token);
  const user = await userRepository.getUserById(dbClient, payload.user_id);
  if (!user) throw new UnauthorizedError("User does not exists");
  const accessToken = authService.generateAccessToken(user.user_id);
  return accessToken;
}
async function getCurrentUser(
  dbClient: Client,
  user_id?: string,
  email?: string,
): Promise<User> {
  if (!user_id && !email)
    throw new NotFoundError("Must provide at least one of identifyable fields");
  let user;
  if (user_id) {
    user = await userRepository.getUserById(dbClient, user_id);
  } else {
    user = await userRepository.getUserByEmail(dbClient, email);
  }
  if (!user) throw new NotFoundError("No such user");
  return user;
}
async function deleteUser(dbClient: Client, user_id: string) {
  const user = await userRepository.getUserById(dbClient, user_id);
  if (user === null) throw new NotFoundError("User not found");
  await userRepository.deleteUser(dbClient, user.user_id);
}

export default {
  registerUser,
  deleteUser,
  loginUser,
  refreshToken,
  getCurrentUser,
  patchUserPassword,
  patchUserEmail,
};
