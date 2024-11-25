/**
 * @typedef {Object} Item
 * @property {string} shortDescription - The short description of the item.
 * @property {number} price - The price of the item.
 */

/**
 * @typedef {Object} Receipt
 * @property {string} retailer - The name of the retailer.
 * @property {string} purchaseDate - The date of the purchase.
 * @property {string} purchaseTime - The time of the purchase.
 * @property {Item[]} items - The list of items purchased.
 * @property {number} total - The total amount of the purchase.
 */

export interface Item {
  shortDescription: string;
  price: number;
}

export interface Receipt {
  retailer: string;
  purchaseDate: Date;
  purchaseTime: string;
  items: Item[];
  total: number;
}

export interface ProcessedReceipt extends Receipt {
  points: number;
}
