import { ValidationError } from "../../src/errors/applicationErrors.js";
import { validateUserCredentials } from "../../src/userFeature/userValidation.js";

describe("User validation tests", () => {
  it("Should not allow empty user", () => {
    expect(() => {
      validateUserCredentials("", "");
    }).toThrow(ValidationError);
  });
});
