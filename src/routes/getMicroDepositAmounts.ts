import { Router, Request, Response } from "express";
import path from "path";
import apexascend from "../utils/ascend";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    console.log('GET / - Serving Get Micro Deposit Amounts HTML', req.body);
    res.sendFile(path.join(__dirname, '..', 'templates', 'getMicroDepositAmounts.html'));
    
});


router.post("/", async (req: Request, res: Response) => {
    try {
        const { accountId, bankRelationshipId } = req.body;
        
        if (!accountId) {
            throw new Error("Account ID is required");
        }

        if (!bankRelationshipId) {
            throw new Error("Bank Relationship ID is required");
        }

        console.log("Using Account ID:", accountId);
        console.log("Using Bank Relationship ID:", bankRelationshipId);

        const result = await apexascend.testSimulation.getMicroDepositAmounts(accountId, bankRelationshipId);
        console.log("Micro deposit amounts retrieved successfully:", JSON.stringify(result, null, 2));

        if (!result) {
            throw new Error("No result received from getMicroDepositAmounts");
        }

        res.json({ 
            success: true, 
            data: result
        });
    } catch (error: any) {
        console.error("Error getting micro deposit amounts:", error);
        
        const statusCode = error.status || 500;
        const errorMessage = error.message || "An unexpected error occurred";
        const errorDetails = error.details || error.response?.data || null;

        res.status(statusCode).json({ 
            success: false, 
            error: {
                message: errorMessage,
                details: errorDetails
            }
        });
    }
});

export default router; 