import passwordService from "../authFeature/passwordService.js";
import authService from "../authFeature/authService.js";
import { ForbiddenError, NotFoundError, UnauthorizedError, } from "../errors/applicationErrors.js";
import { validateUserCredentials, validateUserDisplayedInfo, } from "./userValidation.js";
import userRepository from "./userRepository.js";
async function registerUser(dbClient, email, password, username) {
    validateUserCredentials(email, password);
    validateUserDisplayedInfo(username);
    const existsByEmail = await userRepository.getUserByEmail(dbClient, email);
    if (existsByEmail)
        throw new ForbiddenError("User already exists");
    const hashedPassword = await passwordService.hashPassword(password);
    const user = await userRepository.createUser(dbClient, username, email, hashedPassword);
    if (!user)
        throw new Error("User was not created");
    const accessToken = authService.generateAccessToken(user.user_id);
    return { user, accessToken };
}
async function loginUser(dbClient, email, inputPassword) {
    validateUserCredentials(email, inputPassword);
    const user = await getCurrentUser(dbClient, undefined, email);
    if (!user)
        throw new UnauthorizedError("wrong email");
    const isPasswordCorrect = await passwordService.checkPassword(inputPassword, user.password);
    if (!isPasswordCorrect)
        throw new UnauthorizedError("Wrong password");
    const accessToken = authService.generateAccessToken(user.user_id);
    const refreshToken = authService.generateRefreshToken(user.user_id);
    return {
        user_id: user.user_id,
        accessToken,
        refreshToken,
    };
}
async function patchUserPassword(dbClient, user_id, currentPassword, newPassword) {
    validateUserCredentials(null, newPassword);
    const user = await userRepository.getUserById(dbClient, user_id);
    if (!user)
        throw new NotFoundError("User not found");
    const isCorrect = await passwordService.checkPassword(currentPassword, user.password);
    const isNew = await passwordService.checkPassword(newPassword, user.password);
    if (!isCorrect)
        throw new UnauthorizedError("Wrong password");
    if (!isNew)
        throw new UnauthorizedError("Same password");
    const hash = await passwordService.hashPassword(newPassword);
    const patchedUser = await userRepository.changeUserPassword(dbClient, user_id, hash);
    if (!patchedUser)
        throw new Error("Something went wrong, please try again");
    return;
}
async function patchUserEmail(dbClient, user_id, password, email) {
    await validateUserCredentials(email, password);
    const user = await getCurrentUser(dbClient, user_id);
    if (!user)
        throw new NotFoundError("User not found");
    const isCorrect = await passwordService.checkPassword(password, user.password);
    if (!isCorrect)
        throw new UnauthorizedError("Wrong password");
    if (user.email === email)
        throw new UnauthorizedError("Email is the same");
    const existingUser = await getCurrentUser(dbClient, null, email);
    if (existingUser)
        throw new UnauthorizedError("Email already in use");
    const result = await userRepository.changeUserEmail(dbClient, user.user_id, email);
    if (!result)
        throw new Error("Something went wrong, please try again");
    return;
}
async function refreshAccessToken(dbClient, token) {
    const payload = authService.verifyRefreshToken(token);
    const user = await getCurrentUser(dbClient, payload.user_id);
    if (!user)
        throw new UnauthorizedError("User does not exists");
    const accessToken = authService.generateAccessToken(user.user_id);
    return accessToken;
}
async function getCurrentUser(dbClient, user_id, email) {
    if (!user_id && !email)
        throw new NotFoundError("Must provide at least one of identifyable fields");
    let user;
    if (user_id && email) {
        const userById = await userRepository.getUserById(dbClient, user_id);
        const userByEmail = await userRepository.getUserByEmail(dbClient, email);
        if (!userById || !userByEmail)
            throw new NotFoundError("No such user");
        if (userById != userByEmail)
            throw new NotFoundError("You are searching for different users");
        return userById;
    }
    if (user_id) {
        user = await userRepository.getUserById(dbClient, user_id);
    }
    else {
        user = await userRepository.getUserByEmail(dbClient, email);
    }
    if (!user)
        throw new NotFoundError("No such user");
    return user;
}
async function deleteUser(dbClient, user_id) {
    const user = await userRepository.getUserById(dbClient, user_id);
    if (user === null)
        throw new NotFoundError("User not found");
    await userRepository.deleteUser(dbClient, user.user_id);
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
