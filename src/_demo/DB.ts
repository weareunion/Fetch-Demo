import { ProcessedReceipt } from "../models/receipts/_types/Reciept";
import fs from "fs";
import path from "path";

const DATA_FILE_PATH = path.resolve(__dirname, "data.json");
const PERSIST = process.env.PERSISTENCE === "true";

/**
 * A class to manage the storage and retrieval of processed receipts using a Map.
 */
export class DB {
  private Receipts: Map<string, ProcessedReceipt>;

  constructor() {
    this.Receipts = new Map<string, ProcessedReceipt>();
    if (PERSIST) {
      this.ensureDataFileExists();
      this.loadReceipts();
    }
  }

  /**
   * Ensures that the data.json file exists. If it does not exist, it creates an empty JSON file.
   * @returns {void}
   */
  private ensureDataFileExists(): void {
    try {
      if (!fs.existsSync(DATA_FILE_PATH)) {
        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify({}), "utf-8");
      }
    } catch (error) {
      console.error("Failed to ensure data file exists:", error);
    }
  }

  /**
   * Loads receipts from the data.json file into the Map.
   * @returns {void}
   */
  private loadReceipts(): void {
    try {
      const data = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      const parsedData: Record<string, ProcessedReceipt> = JSON.parse(data);
      this.Receipts = new Map(Object.entries(parsedData));
    } catch (error) {
      console.error("Failed to load receipts:", error);
    }
  }

  /**
   * Unloads receipts from the Map into the data.json file.
   * @returns {void}
   */
  private unloadReceipts(): void {
    try {
      const data = JSON.stringify(Object.fromEntries(this.Receipts), null, 2);
      fs.writeFileSync(DATA_FILE_PATH, data, "utf-8");
    } catch (error) {
      console.error("Failed to unload receipts:", error);
    }
  }

  /**
   * Stores a processed receipt in the database.
   * @param {string} key - The key to store the receipt under.
   * @param {ProcessedReceipt} Receipt - The processed receipt to store.
   * @returns {void}
   */
  public storeReceipt(key: string, Receipt: ProcessedReceipt): void {
    if (typeof key !== "string" || !key) {
      throw new Error("Invalid key: Key must be a non-empty string.");
    }
    if (!Receipt) {
      throw new Error("Invalid Receipt: Receipt cannot be null or undefined.");
    }
    this.Receipts.set(key, Receipt);
    if (PERSIST) {
      this.unloadReceipts();
    }
  }

  /**
   * Retrieves a processed receipt from the database.
   * @param {string} key - The key of the receipt to retrieve.
   * @returns {ProcessedReceipt | undefined} - The retrieved processed receipt or undefined if not found.
   */
  public getReceipt(key: string): ProcessedReceipt | undefined {
    if (typeof key !== "string" || !key) {
      throw new Error("Invalid key: Key must be a non-empty string.");
    }
    return this.Receipts.get(key);
  }

  /**
   * Deletes a processed receipt from the database.
   * @param {string} key - The key of the receipt to delete.
   * @returns {boolean} - True if the receipt was deleted, false otherwise.
   */
  public deleteReceipt(key: string): boolean {
    if (typeof key !== "string" || !key) {
      throw new Error("Invalid key: Key must be a non-empty string.");
    }
    const result = this.Receipts.delete(key);
    if (PERSIST) {
      this.unloadReceipts();
    }
    return result;
  }

  /**
   * Updates an existing processed receipt in the database.
   * @param {string} key - The key of the receipt to update.
   * @param {ProcessedReceipt} updatedReceipt - The updated processed receipt.
   * @returns {boolean} - True if the receipt was updated, false otherwise.
   */
  public updateReceipt(key: string, updatedReceipt: ProcessedReceipt): boolean {
    if (typeof key !== "string" || !key) {
      throw new Error("Invalid key: Key must be a non-empty string.");
    }
    if (!updatedReceipt) {
      throw new Error("Invalid Receipt: Receipt cannot be null or undefined.");
    }
    if (!this.Receipts.has(key)) {
      return false;
    }
    this.Receipts.set(key, updatedReceipt);
    if (PERSIST) {
      this.unloadReceipts();
    }
    return true;
  }
}

// Initialize the database
const db = new DB();

export default db;
