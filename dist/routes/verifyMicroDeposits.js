"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ascend_1 = __importDefault(require("../utils/ascend"));
const router = (0, express_1.Router)();
const verifyMicroDepositsJSONPath = path_1.default.join(__dirname, "..", "assets", "data", "verifyMicroDeposits.json");
router.get("/payload", async (req, res) => {
    console.log('GET /payload - Attempting to serve verify micro deposits payload');
    try {
        const jsonString = fs_1.default.readFileSync(verifyMicroDepositsJSONPath, "utf8");
        const payload = JSON.parse(jsonString);
        console.log('Successfully read payload, sending response');
        res.json(payload);
    }
    catch (error) {
        console.error('Error serving payload:', error);
        res.status(500).json({
            success: false,
            error: {
                message: error.message
            }
        });
    }
});
router.get("/", (req, res) => {
    console.log('GET / - Serving Verify Micro Deposits HTML');
    res.sendFile(path_1.default.join(__dirname, '..', 'templates', 'verifyMicroDeposits.html'));
});
router.post("/", async (req, res) => {
    try {
        const { bankRelationshipId, amount1, amount2 } = req.body;
        if (!bankRelationshipId) {
            throw new Error("Bank Relationship ID is required");
        }
        if (!amount1 || !amount2) {
            throw new Error("Both micro deposit amounts are required");
        }
        console.log("Using Bank Relationship ID:", bankRelationshipId);
        console.log("Amounts:", { amount1, amount2 });
        const result = await ascend_1.default.bankRelationships.verifyMicroDeposits({
            amounts: {
                amount1: {},
                amount2: {},
            },
            name: "accounts/01H8FB90ZRRFWXB4XC2JPJ1D4Y/bankRelationships/651ef9de0dee00240813e60e",
        }, "01H8FB90ZRRFWXB4XC2JPJ1D4Y", "651ef9de0dee00240813e60e");
        console.log("Micro deposits verified successfully:", JSON.stringify(result, null, 2));
        res.json({ success: true, data: result });
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
//# sourceMappingURL=verifyMicroDeposits.js.map