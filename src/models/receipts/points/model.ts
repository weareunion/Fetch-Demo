import express, { Request, Response } from "express";
import db from "../../../_demo/DB";
import { ProcessedReceipt } from "../_types/Reciept";
import { calculatePoints } from "../_helpers/pointsCalculator";

// Since we are getting the params from the parent router, we need to merge them
const router = express.Router({ mergeParams: true });

/**
 * GET /receipts/:id/points
 * Retrieves the points for a given receipt.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
router.get("/", async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    console.log("Getting points for receipt:", id);

    try {
        const receipt = await db.getReceipt(id) as ProcessedReceipt | undefined;

        if (!receipt) {
            res.status(404).json({ error: "Receipt not found" });
            console.warn(`Receipt with ID ${id} not found.`);
            return;
        }

        // Calculate points if not already calculated
        if (receipt.points === undefined) {
            receipt.points = calculatePoints(receipt);
            await db.updateReceipt(id, receipt);
        }

        res.status(200).json({ points: receipt.points });
        console.log(`Points for receipt ID ${id}: ${receipt.points}`);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.error(error);

        if (process.env.ENVIRONMENT === "development") {
          throw error;
        }
    }
});

export default router;
