import { ValidationError } from "../errors/validationError.js";

export default function validateVideoData({ title, description, year }) {
	if (typeof title !== "string" || title.length < 1 || title.length > 100) {
		throw new ValidationError("Invalid title field");
	}
	if (
		typeof description !== "string" ||
		description.length < 1 ||
		description.length > 300
	) {
		throw new ValidationError("Invalid description field");
	}
	if (
		typeof Number(year) !== "number" ||
		year.length !== 4 ||
		Number(year) < 1880 ||
		Number(year) > new Date().getFullYear()
	) {
		throw new ValidationError("Invalid year field");
	}
}
