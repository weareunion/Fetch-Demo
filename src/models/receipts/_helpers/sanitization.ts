import { sanitizeString } from "../../../_common/helpers";
import { Receipt } from "../_types/Reciept";

/**
 * Sanitizes a Receipt object. This should be used to prevent SQL injection 
 * and some other text-based security issues.
 * 
 * This is a good place to add more sanitization logic in the future if needed.
 * @param receipt - The receipt object to sanitize.
 * @returns The sanitized receipt object.
 */
export function sanitizeReceipt(receipt: Receipt): Receipt {
    receipt.retailer = sanitizeString(receipt.retailer);
    receipt.purchaseTime = sanitizeString(receipt.purchaseTime);

    for (const item of receipt.items) {
        item.shortDescription = sanitizeString(item.shortDescription);
    }

    return receipt;
} 
