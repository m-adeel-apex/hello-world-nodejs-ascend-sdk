"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const ascend_1 = __importDefault(require("../utils/ascend"));
const components_1 = require("@apexfintechsolutions/ascend-sdk/models/components");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    console.log('GET / - Serving Bank Relationship SDK Page');
    res.sendFile(path_1.default.join(__dirname, '..', 'templates', 'BankRelationshipPageSDK.html'));
});
router.post("/create", async (req, res) => {
    var _a, _b, _c, _d;
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
        const formattedAccountId = accountId.startsWith('accounts/') ? accountId : `accounts/${accountId}`;
        console.log("Creating bank relationship for account:", formattedAccountId, "with nickname:", nickname);
        try {
            const accountDetails = await ascend_1.default.accountCreation.getAccount(formattedAccountId);
            console.log("Account details:", JSON.stringify(accountDetails, null, 2));
            if (!(accountDetails === null || accountDetails === void 0 ? void 0 : accountDetails.account)) {
                throw new Error("Invalid account response");
            }
            if (accountDetails.account.state === "PENDING") {
                console.log("Account is pending. Attempting to activate...");
                const agreements = await ascend_1.default.enrollmentsAndAgreements.listAgreements(formattedAccountId);
                console.log("Available agreements:", JSON.stringify(agreements, null, 2));
                if (agreements.agreements && agreements.agreements.length > 0) {
                    const agreementIds = agreements.agreements.map((a) => a.agreementId);
                    await ascend_1.default.enrollmentsAndAgreements.affirmAgreements({
                        accountAgreementIds: agreementIds
                    }, formattedAccountId);
                    console.log("Agreements affirmed successfully");
                }
                let retries = 5;
                while (retries > 0) {
                    const updatedAccount = await ascend_1.default.accountCreation.getAccount(formattedAccountId);
                    if (((_a = updatedAccount.account) === null || _a === void 0 ? void 0 : _a.state) === "ACTIVE") {
                        console.log("Account is now active");
                        break;
                    }
                    console.log("Waiting for account activation... Current state:", (_b = updatedAccount.account) === null || _b === void 0 ? void 0 : _b.state);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    retries--;
                }
            }
            const finalAccountCheck = await ascend_1.default.accountCreation.getAccount(formattedAccountId);
            if (!finalAccountCheck.account || finalAccountCheck.account.state !== "ACTIVE") {
                throw new Error(`Account is not active. Current state: ${((_c = finalAccountCheck.account) === null || _c === void 0 ? void 0 : _c.state) || 'unknown'}`);
            }
        }
        catch (error) {
            console.error("Error verifying/activating account:", error);
            throw new Error(`Account verification/activation failed: ${error.message}`);
        }
        const result = await ascend_1.default.bankRelationships.createBankRelationship({
            nickname: nickname,
            verificationMethod: components_1.VerificationMethod.MicroDeposit
        }, formattedAccountId);
        console.log("Bank relationship created successfully:", JSON.stringify(result, null, 2));
        res.json({
            success: true,
            data: result
        });
    }
    catch (error) {
        console.error("Error creating bank relationship:", error);
        const statusCode = error.statusCode || 500;
        let errorMessage = error.message || "Internal server error";
        const errorDetails = error.details || ((_d = error.response) === null || _d === void 0 ? void 0 : _d.data) || null;
        if (errorMessage.includes("Permission denied")) {
            errorMessage = "Permission denied. Please ensure the account ID is valid and you have the necessary permissions.";
        }
        else if (errorMessage.includes("Not Found")) {
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
router.post("/micro-deposits", async (req, res) => {
    try {
        const { accountId, bankRelationshipId } = req.body;
        if (!accountId || !bankRelationshipId) {
            throw new Error("Account ID and Bank Relationship ID are required");
        }
        const result = await ascend_1.default.testSimulation.getMicroDepositAmounts(accountId, bankRelationshipId);
        console.log("Micro deposits retrieved successfully:", JSON.stringify(result, null, 2));
        res.json({
            success: true,
            data: result
        });
    }
    catch (error) {
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
router.post("/verify", async (req, res) => {
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
        const result = await ascend_1.default.bankRelationships.verifyMicroDeposits({
            name: `accounts/${accountId}/bankRelationships/${bankRelationshipId}`,
            amounts: {
                amount1: amounts[0],
                amount2: amounts[1]
            }
        }, accountId, bankRelationshipId);
        console.log("Micro deposits verified successfully:", JSON.stringify(result, null, 2));
        res.json({
            success: true,
            data: result
        });
    }
    catch (error) {
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
exports.default = router;
//# sourceMappingURL=BankRelationshipPageSDK.js.map