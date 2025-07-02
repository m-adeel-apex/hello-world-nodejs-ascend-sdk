import { Router, Request, Response } from "express";
import path from "path";
import apexascend from "../utils/ascend";
import { VerificationMethod } from "@apexfintechsolutions/ascend-sdk/models/components";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    console.log('GET / - Serving iOS Bank Relationship HTML');
    res.sendFile(path.join(__dirname, '..', 'templates', 'ios-bank-relationship.html'));
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const { accountId} = req.body; //nickname
        
        if (!accountId) {
            throw new Error("Account ID is required");
        }

        console.log("Creating bank relationship for account:", accountId);
        console.log("Bank nickname:");

        const result = await apexascend.bankRelationships.createBankRelationship({
            nickname: "My Primary Bank", //My Primary Bank
            verificationMethod: VerificationMethod.MicroDeposit
        }, accountId);

        console.log("Bank relationship created successfully:", JSON.stringify(result, null, 2));
        res.json({ 
            success: true, 
            data: result 
        });
    } catch (error: any) {
        console.error("Error creating bank relationship:", error);
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