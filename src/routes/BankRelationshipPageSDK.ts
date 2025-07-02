import { Router, Request, Response } from "express";
import path from "path";
import apexascend from "../utils/ascend";
import { VerificationMethod } from "@apexfintechsolutions/ascend-sdk/models/components";

interface Agreement {
    agreementId: string;
    [key: string]: any;
}

interface ListAgreementsResponse {
    agreements?: Agreement[];
    [key: string]: any;
}

const router = Router();

router.get("/", (req: Request, res: Response) => {
    console.log('GET / - Serving Bank Relationship SDK Page');
    res.sendFile(path.join(__dirname, '..', 'templates', 'BankRelationshipPageSDK.html'));
});

router.post("/create", async (req: Request, res: Response) => {
    try {
        const { accountId, nickname = "My Primary Bank" } = req.body;
        
        if (!accountId) {
            res.status(400).json({
                success: false,
                error: {
                    message: "Account ID is required"
                }
            });
            return;
        }

        // Format account ID if it doesn't have the proper prefix
        const formattedAccountId = accountId.startsWith('accounts/') ? accountId : `accounts/${accountId}`;
        
        console.log("Creating bank relationship for account:", formattedAccountId, "with nickname:", nickname);

        try {
            // First, verify the account exists and check its state
            const accountDetails = await apexascend.accountCreation.getAccount(formattedAccountId);
            console.log("Account details:", JSON.stringify(accountDetails, null, 2));

            if (!accountDetails?.account) {
                throw new Error("Invalid account response");
            }

            // If account is pending, try to activate it
            if (accountDetails.account.state === "PENDING") {
                console.log("Account is pending. Attempting to activate...");
                
                // Get agreements that need to be affirmed
                const agreements = await apexascend.enrollmentsAndAgreements.listAgreements(formattedAccountId) as ListAgreementsResponse;
                console.log("Available agreements:", JSON.stringify(agreements, null, 2));

                if (agreements.agreements && agreements.agreements.length > 0) {
                    // Affirm all agreements
                    const agreementIds = agreements.agreements.map((a: Agreement) => a.agreementId);
                    await apexascend.enrollmentsAndAgreements.affirmAgreements({
                        accountAgreementIds: agreementIds
                    }, formattedAccountId);
                    console.log("Agreements affirmed successfully");
                }

                // Wait for account to become active
                let retries = 5;
                while (retries > 0) {
                    const updatedAccount = await apexascend.accountCreation.getAccount(formattedAccountId);
                    if (updatedAccount.account?.state === "ACTIVE") {
                        console.log("Account is now active");
                        break;
                    }
                    console.log("Waiting for account activation... Current state:", updatedAccount.account?.state);
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
                    retries--;
                }
            }

            // Verify account is active
            const finalAccountCheck = await apexascend.accountCreation.getAccount(formattedAccountId);
            if (!finalAccountCheck.account || finalAccountCheck.account.state !== "ACTIVE") {
                throw new Error(`Account is not active. Current state: ${finalAccountCheck.account?.state || 'unknown'}`);
            }
        } catch (error) {
            console.error("Error verifying/activating account:", error);
            throw new Error(`Account verification/activation failed: ${error.message}`);
        }

        // Create bank relationship
        const result = await apexascend.bankRelationships.createBankRelationship({
            nickname: nickname,
            verificationMethod: VerificationMethod.MicroDeposit
        }, formattedAccountId);

        console.log("Bank relationship created successfully:", JSON.stringify(result, null, 2));
        res.json({ 
            success: true, 
            data: result 
        });
    } catch (error: any) {
        console.error("Error creating bank relationship:", error);
        const statusCode = error.statusCode || 500;
        let errorMessage = error.message || "Internal server error";
        const errorDetails = error.details || error.response?.data || null;
        
        // Enhance error message for common issues
        if (errorMessage.includes("Permission denied")) {
            errorMessage = "Permission denied. Please ensure the account ID is valid and you have the necessary permissions.";
        } else if (errorMessage.includes("Not Found")) {
            errorMessage = "Account not found or not in the correct state. Please ensure the account exists and is active.";
        }
        
        res.status(statusCode).json({ 
            success: false, 
            error: {
                message: errorMessage,
                details: errorDetails
            }
        });
    }
});

router.post("/micro-deposits", async (req: Request, res: Response) => {
    try {
        const { accountId, bankRelationshipId } = req.body;
        
        if (!accountId || !bankRelationshipId) {
            throw new Error("Account ID and Bank Relationship ID are required");
        }

        const result = await apexascend.testSimulation.getMicroDepositAmounts(accountId, bankRelationshipId);
        console.log("Micro deposits retrieved successfully:", JSON.stringify(result, null, 2));

        res.json({ 
            success: true, 
            data: result 
        });
    } catch (error: any) {
        console.error("Error getting micro deposits:", error);
        res.status(500).json({ 
            success: false, 
            error: {
                message: error.message,
                details: error.details || null
            }
        });
    }
});

router.post("/verify", async (req: Request, res: Response) => {
    try {
        const { bankRelationshipId, amounts, accountId } = req.body;
        
        if (!bankRelationshipId) {
            throw new Error("Bank Relationship ID is required");
        }

        if (!accountId) {
            throw new Error("Account ID is required");
        }

        if (!amounts || !Array.isArray(amounts) || amounts.length !== 2) {
            throw new Error("Two micro deposit amounts are required");
        }

        // Format amounts as objects with value property as required by the API
        const result = await apexascend.bankRelationships.verifyMicroDeposits({
            name: `accounts/${accountId}/bankRelationships/${bankRelationshipId}`,
            amounts: {
                amount1: { value: amounts[0] },
                amount2: { value: amounts[1] }
            }
        }, accountId, bankRelationshipId);

        console.log("Micro deposits verified successfully:", JSON.stringify(result, null, 2));
        res.json({ 
            success: true, 
            data: result 
        });
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