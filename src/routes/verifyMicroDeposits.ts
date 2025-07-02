import { Router, Request, Response } from "express";
import path from "path";
import apexascend from "../utils/ascend";
const router = Router();



router.get("/", (req: Request, res: Response) => {
    console.log('GET / - Serving Verify Micro Deposits HTML');
    res.sendFile(path.join(__dirname, '..', 'templates', 'verifyMicroDeposits.html'));
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const { name, accountId, bankRelationshipId, amount1, amount2 } = req.body;

        // Format amounts as objects with value property as required by the API
        const amountsObject = {
            amount1: { value: amount1 },
            amount2: { value: amount2 },
        };

        if (!bankRelationshipId) {
            throw new Error("Bank Relationship ID is required");
        }

        if (!amount1 || !amount2) {
            throw new Error("Both micro deposit amounts are required");
        }

        console.log("Using Bank Relationship ID:", bankRelationshipId);
        console.log("Amounts:", amountsObject);

        const result = await apexascend.bankRelationships.verifyMicroDeposits({ amounts: amountsObject, name },
            accountId, bankRelationshipId);

        console.log("Micro deposits verified successfully:", JSON.stringify(result, null, 2));
        res.json({ success: true, data: result });
    } catch (error: any) {
        console.error("Error verifying micro deposits:", error);
        res.status(500).json({
            success: false,
            error: {
                message: error.message,
                details: error.details || null
            }
        });
    }
});

export default router; 