import { Router, Request, Response } from "express";
import apexascend from "../utils/ascend";

const router = Router();

// Serve the Affirm Account page
router.get("/", (req: Request, res: Response) => {
  res.render('affirmAccount');
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
    try {
        const { agreementIds, accountId } = req.body;
        
        if (!accountId) {
            res.status(400).json({
                success: false,
                error: "Account ID is required"
            });
            return;
        }

        if (!agreementIds || !Array.isArray(agreementIds) || agreementIds.length === 0) {
            res.status(400).json({
                success: false,
                error: "At least one Agreement ID is required"
            });
            return;
        }

        const formattedAccountId = accountId.startsWith('accounts/') ? accountId : `accounts/${accountId}`;

        console.log("Using Agreement IDs:", agreementIds);
        console.log("Formatted Account ID:", formattedAccountId);

        // Ensure agreementIds is an array of strings
        const cleanAgreementIds = agreementIds.map(id => id.toString().trim());

        const result = await apexascend.enrollmentsAndAgreements.affirmAgreements({
            accountAgreementIds: cleanAgreementIds
        }, formattedAccountId);

        console.log("Affirmation result:", JSON.stringify(result, null, 2));

        res.json({
            success: true,
            data: result
        });

    } catch (error: any) {
        console.error("Error affirming account:", error);
        res.status(500).json({
            success: false,
            error: {
                message: error.message || "An error occurred during affirmation",
                details: error.response?.data || null
            }
        });
    }
});

export default router; 