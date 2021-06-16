export const validateContainsOneUppercaseLetter = (
  value: string | undefined,
): boolean => value !== undefined && /(?=.*[A-Z])/.test(value);

export const validateContainsOneSpecialLetter = (
  value: string | undefined,
): boolean => value !== undefined && /(.*\W.*)/.test(value);
