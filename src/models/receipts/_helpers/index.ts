export * from "./validation";
export * from "./extraction";
export * from "./sanitization";
export * from "./pointsCalculator";

/**
 * Transforms the input data into a proper Receipt object.
 * @param data - The input data to transform.
 * @returns The transformed Receipt object.
 * @throws {UserPresentableError} If any validation fails.
 */
import { validateDataObject } from "./validation";
import { extractRetailer, extractPurchaseDate, extractPurchaseTime, extractItems, extractTotal } from "./extraction";
import UserPresentableError from "../../../common/exceptions/UserPresentableError";
import { Receipt } from "../_types/Reciept";

export function transformReceiptData(data: unknown): Receipt {
    validateDataObject(data);

    const retailer = extractRetailer(data);
    const purchaseDate = extractPurchaseDate(data);
    const purchaseTime = extractPurchaseTime(data);
    const items = extractItems(data);
    const total = extractTotal(data);

    const calculatedTotal = getCalculatedTotal(items);

    const precision = 0.01; // precision level to handle JS floating-point errors

    if (Math.abs(calculatedTotal - total) > precision) {
        throw new UserPresentableError(`Invalid data: calculated total (${calculatedTotal}) does not match the provided total (${total}).`);
    }

    return { retailer, purchaseDate, purchaseTime, items, total };
}

/**
 * Calculates the sum of item prices.
 * @param items - The array of items.
 * @returns The calculated total.
 */
function getCalculatedTotal(items: Receipt["items"]): number {
    return items.reduce((acc, item) => acc + item.price, 0);
} 
