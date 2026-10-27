import userService from "./userService.js";
import passwordService from "../authFeature/passwordService.js";
import authService from "../authFeature/authService.js";
import {
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
} from "../errors/applicationErrors.js";
import {
  validateUserCredentials,
  validateUserDisplayedInfo,
} from "./userValidation.js";
import type { User } from "./types/userType.js";
import userRepository from "./userRepository.js";
async function registerUser(
  dbClient: Client,
  email: string,
  password: string,
  username: string,
): Promise<{ user: User; accessToken: string }> {
  validateUserCredentials(email, password);
  validateUserDisplayedInfo(username);
  const existsByEmail = await userService.getCurrentUser(dbClient, email);
  if (existsByEmail) throw new ForbiddenError("User already exists");
  const hashedPassword = await passwordService.hashPassword(password);
  const { user } = await userService.registerUser(
    dbClient,
    email,
    hashedPassword,
    username,
  );
  const accessToken = authService.generateAccessToken(user.user_id);
  return {
    user,
    accessToken,
  };
}
async function loginUser(
  dbClient: Client,
  email: string,
  password: string,
): Promise<{ user: User; accessToken: string; refreshToken: string }> {
  validateUserCredentials(email, password);
  const user = await userRepository.getUserByEmail(dbClient, email);
  if (!user) throw new UnauthorizedError("Wrong email");
  const isPasswordCorrect = await passwordService.checkPassword(
    password,
    user.password,
  );
  if (!isPasswordCorrect) throw new UnauthorizedError("Wrong password");
  const accessToken = authService.generateAccessToken(user.user_id);
  const refreshToken = authService.generateRefreshToken(user.user_id);
  return {
    user,
    accessToken,
    refreshToken,
  };
}
async function getCurrentUser(dbClient: Client, user_id: string) {
  const user = await userRepository.getUserById(dbClient, user_id);
  if (!user) throw new NotFoundError("User not found");
  return user;
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
  const patchedUser = await userService.patchUserPassword(
    dbClient,
    user_id,
    user.password,
    hash,
  );
  return;
}
async function patchUserEmail(
  dbClient: Client,
  user_id: string,
  password: string,
  email: string,
) {
  validateUserCredentials(email, password);
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
  await userService.patchUserEmail(dbClient, user_id, password, email);
  return;
}
async function refreshAccessToken(dbClient: Client, token: string) {
  const payload = authService.verifyRefreshToken(token);
  const user = await userRepository.getUserById(dbClient, payload.user_id);
  if (!user) throw new UnauthorizedError("User does not exists");
  const accessToken = authService.generateAccessToken(user.user_id);
  return accessToken;
}
async function deleteUser(dbClient: Client, user_id: string) {
  const user = await userRepository.getUserById(dbClient, user_id);
  if (user === null) throw new NotFoundError("User not found");
  userService.deleteUser(dbClient, user.user_id);
}
export default {
  registerUser,
  deleteUser,
  loginUser,
  refreshAccessToken,
  getCurrentUser,
  patchUserPassword,
  patchUserEmail,
};
