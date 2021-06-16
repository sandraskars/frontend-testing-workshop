import {
  validateContainsOneSpecialLetter,
  validateContainsOneUppercaseLetter,
} from "./validation-utils";

describe("form validation", () => {
  describe("validateContainsOneUppercaseLetter", () => {
    it("should return true for string containing one uppercase letter", () => {
      expect(validateContainsOneUppercaseLetter("hAlloen123")).toBe(true);
    });

    it("should return false for string containing zero uppercase letters", () => {
      expect(validateContainsOneUppercaseLetter("halloen123")).toBe(false);
    });
  });

  describe("validateContainsOneSpecialCharacter", () => {
    it("should return true for string containing one special character", () => {
      expect(validateContainsOneSpecialLetter("h@lloen123")).toBe(true);
    });

    it("should return false for string containing zero special characters", () => {
      expect(validateContainsOneSpecialLetter("halloen123")).toBe(false);
    });
  });
});
