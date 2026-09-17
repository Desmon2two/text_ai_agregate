import { ValidationError } from "../errors/validationError.js";

function validateUserPatch(username, displayName, profilePic, bio) {
  if (!username && !displayName && !profilePic && !bio) throw new ValidationError("No user fields to validate");
  
  if (username !== undefined) {
    if (
      typeof username !== "string" ||
      username.length < 3 ||
      username.length > 25
    )
      throw new ValidationError("Invalid username");
  }
  if (displayName !== undefined) {
    if (
      typeof displayName !== "string" ||
      displayName.length < 1 ||
      displayName.length > 25
    )
      throw new ValidationError("Invalid displayName");
  }
  if (profilePic !== undefined) {
    if (
      typeof profilePic !== "string" ||
      profilePic.length < 1
    )
      throw new ValidationError("Invalid profile picture");
  }
  if (bio !== undefined) {
    if (typeof bio !== "string" || bio.length > 250)
      throw new ValidationError("Invalid bio");
  }
  return;
}
function validateCredentialsPatch({ email, password }) {
if (!email && !password) {
  throw new ValidationError("No credential to validate")
}
  if (email !== undefined) {
    if (
      typeof email !== "string" ||
      email.length < 1 ||
      email.length > 50 ||
      !email.includes("@") ||
      !email.includes(".")
    )
      throw new ValidationError("Invalid email");
  }
  if (password !== undefined) {
    if (
      typeof password !== "string" ||
      password.length < 4 ||
      password.length > 25 ||
      password.search(/[A-Z]/) === -1 ||
      password.search(/[a-z]/) === -1 ||
      password.search(/[0-9]/) === -1
    )
      throw new ValidationError("Invalid password");
  }
  return;
}
export default { validateUserPatch, validateCredentialsPatch };
