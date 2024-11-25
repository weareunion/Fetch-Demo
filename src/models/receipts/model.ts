import express, { Request, Response } from "express";
import UserPresentableError from "../../common/exceptions/UserPresentableError";
import db from "../../_demo/DB";
import { generateUUID } from "../../common/helpers";
import pointsRouter from "./points/model";
import { transformReceiptData } from "./_helpers";
import { sanitizeReceipt } from "./_helpers/sanitization";
import { getProcessedReceipt } from "./_helpers/pointsCalculator";
import { Receipt } from "./_types/Reciept";

const router = express.Router();

/**
 * GET /Receipt/:id
 * Retrieves a Receipt by its ID.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const Receipt = await db.getReceipt(id);

    if (!Receipt) {
      res.status(404).json({ error: "Receipt not found" });
      return;
    }

    res.status(200).json(Receipt);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });

    // Here we could log the error for debugging purposes.
    // Normally, we should have a centralized error handling system in place.
    // Or at least error logging system to inform
    console.error(error);
  }
});


/**
 * @typedef {Object} ProcessRequestBody
 * @property {string} data - The data to be processed.
 */

/**
 * @typedef {Object} ProcessResponseBody
 * @property {string} result - The result of the processing.
 */

/**
 * POST /process
 * Processes the input data and returns the result.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
router.post("/process", (req: Request, res: Response): void => {
  const { body: data } = req

  console.log("Processing Receipt...");
  console.log(data);

  if (typeof data !== "object" || data === null) {
    res.status(400).json({ error: "Invalid input data" });
    return;
  }

  let receipt: Receipt = data as Receipt;

  try {
    receipt = transformReceiptData(receipt);
    const sanitizedReceipt = sanitizeReceipt(receipt);
    const processedReceipt = getProcessedReceipt(sanitizedReceipt);
    const key = generateUUID();

    db.storeReceipt(key, processedReceipt);

    res.json({ id: key });
  } catch (error) {
    console.log(error);
    if (error instanceof UserPresentableError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });

      // Here we could log the error for debugging purposes.
      // Normally, we should have a centralized error handling system in place.
      // Or at least error logging system to inform
      console.error('Error transforming receipt data:', error);

      if (process.env.NODE_ENV === "development") {
        throw error;
      }
    }
    return;
  }

});

router.use("/:id/points", pointsRouter);

export default router;
