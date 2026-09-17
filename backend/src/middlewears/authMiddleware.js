import authService from "../authFeature/authService.js";
import { UnauthorizedError } from "../errors/unauthorizedError.js";

function authenticate(req, res, next) {
	try {
		const { accessToken } = req.cookies;
		if (!accessToken) throw new UnauthorizedError("Authentication required");
		const user = authService.verifyAccessToken(accessToken);
		req.user = user;
		next();
	} catch (error) {
		next(error);
	}
}

export default authenticate;
