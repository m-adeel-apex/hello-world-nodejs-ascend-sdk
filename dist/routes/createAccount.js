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
const getAccountJSONPath = path_1.default.join(__dirname, "..", "assets", "data", "createAccount.json");
console.log('JSON Payload Path:', getAccountJSONPath);
const createAccountPayload = () => {
    try {
        console.log('Checking file exists at:', getAccountJSONPath);
        if (!fs_1.default.existsSync(getAccountJSONPath)) {
            console.error(`File not found: ${getAccountJSONPath}`);
            throw new Error("Payload file not found");
        }
        console.log('Reading file...');
        const payload = JSON.parse(fs_1.default.readFileSync(getAccountJSONPath, "utf8"));
        console.log('Successfully parsed payload');
        return payload;
    }
    catch (error) {
        console.error("Error reading create Account payload:", error);
        throw error;
    }
};
router.get("/", (req, res) => {
    console.log('GET / - Rendering Create Account template');
    res.render('createAccount');
});
router.get("/payload", (req, res) => {
    console.log('GET /payload - Attempting to serve payload');
    try {
        console.log("Reading payload from:", getAccountJSONPath);
        const payload = createAccountPayload();
        console.log('Successfully read payload, sending response');
        res.type('application/json').send(JSON.stringify(payload));
    }
    catch (error) {
        console.error('Error serving payload:', error);
        res.status(500).type('application/json').send(JSON.stringify({
            success: false,
            error: {
                message: error.message
            }
        }));
    }
});
router.post("/", async (_req, res) => {
    try {
        const payloadPath = path_1.default.join(__dirname, "../assets/data/createAccount.json");
        const payload = JSON.parse(fs_1.default.readFileSync(payloadPath, "utf-8"));
        console.log("Creating legal natural person with payload:", JSON.stringify(payload, null, 2));
        const result = await ascend_1.default.accountCreation.createAccount(payload);
        console.log("Account successful created:", JSON.stringify(result, null, 2));
        res.json({ success: true, data: result });
    }
    catch (error) {
        console.error("Error creating account:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=createAccount.js.map