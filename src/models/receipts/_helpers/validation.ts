import UserPresentableError from "../../../common/exceptions/UserPresentableError";

/**
 * Validates that the input data is a non-null object.
 * @param data - The data to validate.
 * @throws {UserPresentableError} If the data is not a valid object.
 */
export function validateDataObject(data: unknown): asserts data is Record<string, unknown> {
    if (typeof data !== "object" || data === null) {
        throw new UserPresentableError("Invalid data: must be an object.");
    }
}

/**
 * Validates that a value is a non-empty, trimmed string.
 * @param value - The string to validate.
 * @param fieldName - The name of the field being validated.
 * @throws {UserPresentableError} If the value is not a valid trimmed string.
 */
function validateTrimmedString(value: unknown, fieldName: string): string {
    if (typeof value !== "string") {
        throw new UserPresentableError(`Invalid data: ${fieldName} must be a string.`);
    }
    const trimmedValue = value.trim();
    if (!trimmedValue) {
        throw new UserPresentableError(`Invalid data: ${fieldName} must be a non-empty string.`);
    }
    return trimmedValue;
}

/**
 * Validates that a value is a valid date string.
 * @param value - The date string to validate.
 * @throws {UserPresentableError} If the value is not a valid date.
 */
function validateDateString(value: unknown): Date {
    if (typeof value !== "string") {
        throw new UserPresentableError("Invalid data: purchaseDate must be a string.");
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
        throw new UserPresentableError("Invalid data: purchaseDate must be a valid date.");
    }
    return date;
}

/**
 * Validates that a value is a valid number string.
 * @param value - The number string to validate.
 * @param fieldName - The name of the field being validated.
 * @throws {UserPresentableError} If the value is not a valid number string.
 */
function validateNumberString(value: unknown, fieldName: string): number {
    if (typeof value === "number") {
        return value;
    }

    if (typeof value !== "string" || isNaN(parseFloat(value))) {
        throw new UserPresentableError(`Invalid data: ${fieldName} must be a valid string representing a number.`);
    }
    return parseFloat(value);
}

export {
    validateTrimmedString,
    validateDateString,
    validateNumberString
}; 
