import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/unauthorizedError.js";

function generateAccessToken(userId) {
  return jwt.sign({ userId, type: "access" }, process.env.JWT_SECRET, {
		expiresIn: "1h",
	});
};

function verifyAccessToken(token){
  try {
    const result = jwt.verify(token, process.env.JWT_SECRET)
    if (result.type !== "access")
			throw new UnauthorizedError("Invalid authorization");
    return result
  } catch (error) {
    if(error.name === "TokenExpiredError") throw new UnauthorizedError("Access allowance expired");
    if (error.name === "JsonWebTokenError")
      throw new UnauthorizedError("Invalid authorization");
    throw error
  }
}

function generateRefreshToken(userId) {
  return jwt.sign({ userId, type: "refresh" }, process.env.JWT_SECRET, {
		expiresIn: "14d",
	});
};
function verifyRefreshToken(token){
  try {
    const result = jwt.verify(token, process.env.JWT_SECRET)
    if(result.type !== "refresh") throw new UnauthorizedError("Invalid authorization");
    return result
  } catch (error) {
    if(error.name === "TokenExpiredError") throw new UnauthorizedError("Please log in");
    if (error.name === "JsonWebTokenError")
      throw new UnauthorizedError("Invalid authorization");
    throw error
  }
}
export default {
	generateAccessToken,
	verifyAccessToken,
	generateRefreshToken,
	verifyRefreshToken,
};
