import { validateTrimmedString, validateDateString, validateNumberString } from "./validation";
import UserPresentableError from "../../../common/exceptions/UserPresentableError";
import { Item, Receipt } from "../_types/Reciept";

/**
 * Extracts and validates the retailer from the data.
 * @param data - The input data containing the retailer.
 * @returns The validated and trimmed retailer string.
 * @throws {UserPresentableError} If the retailer is not a valid trimmed string.
 */
export function extractRetailer(data: Record<string, unknown>): string {
    return validateTrimmedString(data.retailer, "retailer");
}

/**
 * Extracts and validates the purchase date from the data.
 * @param data - The input data containing the purchase date.
 * @returns The validated purchase Date object.
 * @throws {UserPresentableError} If the purchase date is not a valid date.
 */
export function extractPurchaseDate(data: Record<string, unknown>): Date {
    return validateDateString(data.purchaseDate);
}

/**
 * Extracts and validates the purchase time from the data.
 * @param data - The input data containing the purchase time.
 * @returns The validated and trimmed purchase time string.
 * @throws {UserPresentableError} If the purchase time is not a valid trimmed string.
 */
export function extractPurchaseTime(data: Record<string, unknown>): string {
    return validateTrimmedString(data.purchaseTime, "purchaseTime");
}

/**
 * Extracts and validates the items array from the data.
 * @param data - The input data containing the items.
 * @returns The validated array of items.
 * @throws {UserPresentableError} If the items are not a valid array.
 */
export function extractItems(data: Record<string, unknown>): Receipt["items"] {
    const items = data.items;
    if (!Array.isArray(items)) {
        throw new UserPresentableError("Invalid data: items must be an array.");
    }

    return items.map((item: unknown, index: number): Item => {
        if (typeof item !== "object" || item === null) {
            throw new UserPresentableError(`Invalid data: item at index ${index} must be an object.`);
        }

        const itemRecord = item as Record<string, unknown>;

        const shortDescription = validateTrimmedString(itemRecord.shortDescription, `item shortDescription at index ${index}`);
        const price = validateNumberString(itemRecord.price, `item price at index ${index}`);

        return { shortDescription, price };
    });
}

/**
 * Extracts and validates the total from the data.
 * @param data - The input data containing the total.
 * @returns The validated total number.
 * @throws {UserPresentableError} If the total is not a valid number.
 */
export function extractTotal(data: Record<string, unknown>): number {
    return validateNumberString(data.total, "total");
} 
