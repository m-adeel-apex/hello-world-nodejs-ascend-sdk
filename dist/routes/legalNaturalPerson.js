"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ascend_sdk_1 = require("@apexfintechsolutions/ascend-sdk");
const router = (0, express_1.Router)();
const legalNaturalPersonJSONPath = path_1.default.join(__dirname, "..", "assets", "data", "createLegalNaturalPerson.json");
console.log('JSON Payload Path:', legalNaturalPersonJSONPath);
const getLegalNaturalPersonPayload = () => {
    try {
        console.log('Checking file exists at:', legalNaturalPersonJSONPath);
        if (!fs_1.default.existsSync(legalNaturalPersonJSONPath)) {
            console.error(`File not found: ${legalNaturalPersonJSONPath}`);
            throw new Error("Payload file not found");
        }
        console.log('Reading file...');
        const payload = JSON.parse(fs_1.default.readFileSync(legalNaturalPersonJSONPath, "utf8"));
        console.log('Successfully parsed payload');
        return payload;
    }
    catch (error) {
        console.error("Error reading legal natural person payload:", error);
        throw error;
    }
};
router.get("/", (req, res) => {
    console.log('GET / - Rendering legalNaturalPerson template');
    res.render('legalNaturalPerson');
});
router.get("/payload", (req, res) => {
    console.log('GET /payload - Attempting to serve payload');
    try {
        console.log("Reading payload from:", legalNaturalPersonJSONPath);
        const payload = getLegalNaturalPersonPayload();
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
        const payloadPath = path_1.default.join(__dirname, "../assets/data/createLegalNaturalPerson.json");
        const payload = JSON.parse(fs_1.default.readFileSync(payloadPath, "utf-8"));
        console.log("Creating legal natural person with payload:", JSON.stringify(payload, null, 2));
        const apexascend = new ascend_sdk_1.Apexascend();
        const result = await apexascend.personManagement.createLegalNaturalPerson(payload);
        console.log("Legal natural person creation successful:", JSON.stringify(result, null, 2));
        res.json({ success: true, data: result });
    }
    catch (error) {
        console.error("Error creating legal natural person:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=legalNaturalPerson.js.map