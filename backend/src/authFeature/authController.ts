import userService from "../userFeature/userService.js";
import { dbClient } from "../server.js";

async function registerUser(req, res, next) {
  try {
    const { email, password, username } = req.body;
    const result = await userService.registerUser(
      dbClient,
      email,
      password,
      username,
    );
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });
    res.status(201).send();
  } catch (error) {
    next(error);
  }
}
async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(dbClient, email, password);
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });
    res.status(200).send();
  } catch (error) {
    next(error);
  }
}
async function logoutUser(req, res, next) {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
async function refreshAccessToken(req, res, next) {
  try {
    const { token } = req.body;
    const { accessToken } = await userService.refreshAccessToken(
      dbClient,
      token,
    );
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });
    res.status(200).send();
  } catch (error) {
    next(error);
  }
}
async function deleteUser(req, res, next) {
  try {
    const { userId } = req.user;
    await userService.deleteUser(dbClient, userId);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
async function getCurrentUser(req, res, next) {
  try {
    const { userId, email } = req.user;
    const result = await userService.getCurrentUser(dbClient, userId, email);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
// async function patchUser(req, res, next) {
// 	try {
// 		const { userId } = req.user;
// 		const userData = req.body;
// 		const result = await userService.(dbClient, userId, userData);
// 		res.status(200).json(result);
// 	} catch (error) {
// 		next(error);
// 	}
// }
async function patchUserPassword(req, res, next) {
  try {
    const { userId } = req.user;
    const { currentPassword, newPassword } = req.body;
    await userService.patchUserPassword(
      dbClient,
      userId,
      currentPassword,
      newPassword,
    );
    res.status(200).json({ message: "Password changed" });
  } catch (error) {
    next(error);
  }
}
async function patchUserEmail(req, res, next) {
  try {
    const { userId } = req.user;
    const { email, password } = req.body;
    await userService.patchUserEmail(dbClient, userId, password, email);
    res.status(200).json({ message: "Email changed" });
  } catch (error) {
    next(error);
  }
}

export default {
  registerUser,
  deleteUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  // patchUser,
  patchUserPassword,
  patchUserEmail,
};
