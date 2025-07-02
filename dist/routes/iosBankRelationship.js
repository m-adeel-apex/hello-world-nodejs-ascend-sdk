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
    console.log('GET / - Serving iOS Bank Relationship HTML');
    res.sendFile(path_1.default.join(__dirname, '..', 'templates', 'ios-bank-relationship.html'));
});
router.post("/", async (req, res) => {
    try {
        const { accountId } = req.body;
        if (!accountId) {
            throw new Error("Account ID is required");
        }
        console.log("Creating bank relationship for account:", accountId);
        console.log("Bank nickname:");
        const result = await ascend_1.default.bankRelationships.createBankRelationship({
            nickname: "My Primary Bank",
            verificationMethod: components_1.VerificationMethod.MicroDeposit
        }, accountId);
        console.log("Bank relationship created successfully:", JSON.stringify(result, null, 2));
        res.json({
            success: true,
            data: result
        });
    }
    catch (error) {
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
exports.default = router;
//# sourceMappingURL=iosBankRelationship.js.map