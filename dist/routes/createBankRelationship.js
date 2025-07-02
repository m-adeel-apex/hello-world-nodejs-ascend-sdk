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
const createBankRelationshipJSONPath = path_1.default.join(__dirname, "..", "assets", "data", "createBankRelationship.json");
const updateBankAccountDetails = async () => {
    try {
        if (!fs_1.default.existsSync(createBankRelationshipJSONPath)) {
            throw new Error(`JSON file not found at: ${createBankRelationshipJSONPath}`);
        }
        const jsonString = fs_1.default.readFileSync(createBankRelationshipJSONPath, "utf8");
        const bankRelationshipPayload = JSON.parse(jsonString);
        const routingNumber = "112203216";
        const accountNumber = generateRandomNumberString(10);
        bankRelationshipPayload.bankAccount.routingNumber = routingNumber;
        bankRelationshipPayload.bankAccount.accountNumber = accountNumber;
        fs_1.default.writeFileSync(createBankRelationshipJSONPath, JSON.stringify(bankRelationshipPayload, null, 2));
        console.log("Updated JSON successfully saved:", createBankRelationshipJSONPath);
        return bankRelationshipPayload;
    }
    catch (error) {
        console.error("Error updating bank account details:", error);
        throw error;
    }
};
const generateRandomNumberString = (length) => {
    let result = "";
    const digits = "1121932263";
    for (let i = 0; i < length; i++) {
        result += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return result;
};
router.get("/payload", async (req, res) => {
    console.log('GET /payload - Attempting to serve payload');
    try {
        const updatedPayload = await updateBankAccountDetails();
        console.log('Successfully generated payload:', JSON.stringify(updatedPayload, null, 2));
        res.json(updatedPayload);
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
    console.log('GET / - Serving Create Bank Relationship HTML');
    res.sendFile(path_1.default.join(__dirname, '..', 'templates', 'createBankRelationship.html'));
});
router.post("/", async (req, res) => {
    try {
        const accountId = req.body.accountId || req.query.accountId;
        if (!accountId) {
            throw new Error("Account ID is required");
        }
        console.log("Using Account ID:", accountId);
        const updatedPayload = await updateBankAccountDetails();
        console.log("Updated createBankRelationship payload:", JSON.stringify(updatedPayload, null, 2));
        const result = await ascend_1.default.bankRelationships.createBankRelationship(updatedPayload, accountId);
        const bankRelationship = result.bankRelationship;
        console.log("Bank Relationship successfully created:", JSON.stringify(bankRelationship, null, 2));
        res.json({
            success: true,
            data: bankRelationship
        });
    }
    catch (error) {
        console.error("Error creating Bank Relationship:", error);
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
//# sourceMappingURL=createBankRelationship.js.map