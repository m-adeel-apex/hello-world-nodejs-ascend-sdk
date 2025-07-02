"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const ascend_1 = __importDefault(require("../utils/ascend"));
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    console.log('GET / - Serving Get Micro Deposit Amounts HTML');
    res.sendFile(path_1.default.join(__dirname, '..', 'templates', 'getMicroDepositAmounts.html'));
});
router.post("/", async (req, res) => {
    var _a;
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
        const result = await ascend_1.default.testSimulation.getMicroDepositAmounts(accountId, bankRelationshipId);
        console.log("Micro deposit amounts retrieved successfully:", JSON.stringify(result, null, 2));
        if (!result) {
            throw new Error("No result received from getMicroDepositAmounts");
        }
        res.json({
            success: true,
            data: result
        });
    }
    catch (error) {
        console.error("Error getting micro deposit amounts:", error);
        const statusCode = error.status || 500;
        const errorMessage = error.message || "An unexpected error occurred";
        const errorDetails = error.details || ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || null;
        res.status(statusCode).json({
            success: false,
            error: {
                message: errorMessage,
                details: errorDetails
            }
        });
    }
});
exports.default = router;
//# sourceMappingURL=getMicroDepositAmounts.js.map