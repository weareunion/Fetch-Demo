import { ProcessedReceipt, Receipt } from "../_types/Reciept";

/**
 * Point values for different criteria.
 */
const POINT_VALUES = {
    ALPHANUMERIC_RETAILER: 1,
    ROUND_DOLLAR_TOTAL: 50,
    MULTIPLE_OF_25_TOTAL: 25,
    EVERY_TWO_ITEMS: 5,
    ITEM_DESCRIPTION_MULTIPLE_OF_3: 0.2,
    ODD_DAY_PURCHASE: 6,
    PURCHASE_TIME_BONUS: 10
};

/**
 * A collection of functions to calculate points based on different criteria.
 */
export const pointCalculators = {
    calculateRetailerPoints: (receipt: Receipt): number => {
        const alphanumericCount = receipt.retailer.replace(/[^a-z0-9]/gi, "").length;
        return alphanumericCount * POINT_VALUES.ALPHANUMERIC_RETAILER;
    },
    calculateRoundDollarTotalPoints: (receipt: Receipt): number => {
        return receipt.total % 1 === 0 ? POINT_VALUES.ROUND_DOLLAR_TOTAL : 0;
    },
    calculateMultipleOf25TotalPoints: (receipt: Receipt): number => {
        return receipt.total % 0.25 === 0 ? POINT_VALUES.MULTIPLE_OF_25_TOTAL : 0;
    },
    calculateItemPoints: (receipt: Receipt): number => {
        return Math.floor(receipt.items.length / 2) * POINT_VALUES.EVERY_TWO_ITEMS;
    },
    calculateItemDescriptionPoints: (receipt: Receipt): number => {
        return receipt.items.reduce((acc, item) => {
            const trimmedLength = item.shortDescription.trim().length;
            if (trimmedLength % 3 === 0) {
                acc += Math.ceil(item.price * POINT_VALUES.ITEM_DESCRIPTION_MULTIPLE_OF_3);
            }
            return acc;
        }, 0);
    },
    calculateOddDayPurchasePoints: (receipt: Receipt): number => {
        const day = receipt.purchaseDate.getDate();
        return day % 2 !== 0 ? POINT_VALUES.ODD_DAY_PURCHASE : 0;
    },
    calculatePurchaseTimePoints: (receipt: Receipt): number => {
        const purchaseTime = new Date(`1970-01-01T${receipt.purchaseTime}Z`);
        const start = new Date("1970-01-01T14:00:00Z");
        const end = new Date("1970-01-01T16:00:00Z");
        return purchaseTime >= start && purchaseTime < end ? POINT_VALUES.PURCHASE_TIME_BONUS : 0;
    }
};

/**
 * Calculates the points for a receipt.
 * @param {Receipt} receipt - The receipt to calculate points for.
 * @returns {number} - The number of points for the receipt.
 */
export function calculatePoints(receipt: Receipt): number {
    return Object.values(pointCalculators).reduce((acc, calc) => acc + calc(receipt), 0);
}

/**
 * Returns a new ProcessedReceipt object with the points calculated.
 * @param {Receipt} receipt - The receipt to process.
 * @returns {ProcessedReceipt} - The processed receipt with points.
 */
export function getProcessedReceipt(receipt: Receipt | ProcessedReceipt): ProcessedReceipt {
    return { ...receipt, points: calculatePoints(receipt) };
}

/**
 * Type guard to check if a receipt is a ProcessedReceipt.
 * @param receipt - The receipt to check.
 * @returns {boolean} - True if the receipt has points, false otherwise.
 */
export function isProcessedReceipt(receipt: Receipt | ProcessedReceipt): receipt is ProcessedReceipt {
    return "points" in receipt;
}

/**
 * Determines if points should be calculated for the receipt.
 * @param receipt - The receipt to check.
 * @returns {boolean} - True if points should be calculated, false otherwise.
 */
export function shouldCalculatePoints(receipt: Receipt | ProcessedReceipt): boolean {
    return !isProcessedReceipt(receipt);
} 
