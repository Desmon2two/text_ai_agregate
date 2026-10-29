import { ApplicationError } from "../errors/applicationErrors.js";

function errorHandler(err, req, res, next) {
  if (err instanceof ApplicationError)
    return res.status(err.statusCode).json({ message: err.message });
  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
}

export default errorHandler;
