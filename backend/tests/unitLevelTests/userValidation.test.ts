import { ValidationError } from "../../src/errors/applicationErrors.js";
import { validateUserCredentials } from "../../src/userFeature/userValidation.js";

describe("User validation tests", () => {
  it("Should not allow invalid inputs", () => {
    expect(() => {
      validateUserCredentials("", "");
    }).toThrow(ValidationError);
    expect(() => {
      validateUserCredentials(null, null);
    }).toThrow(ValidationError);
    expect(() => {
      validateUserCredentials(
        "JUST SOME OBSCENE EMAIL",
        "ACTUALLY_mAYBE_VALID_PASSWORD",
      );
    }).toThrow(ValidationError);
    expect(() => {
      validateUserCredentials("passingEmail@gmaul", "(Not really passing)");
    }).toThrow(ValidationError);
    expect(() => {
      validateUserCredentials(
        "trickedYa@gmail.com",
        "ActuallyGoodPassword!!!ButIt may be a little long for this format",
      );
    }).toThrow(ValidationError);
  });
});
