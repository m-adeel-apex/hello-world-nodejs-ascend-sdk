"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ascend_1 = require("../utils/ascend");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.render('affirmAccount');
});
router.post("/", async (req, res) => {
    var _a;
    try {
        const { accountId, agreementId } = req.body;
        if (!accountId || !agreementId) {
            res.status(400).json({
                success: false,
                error: { message: "Account ID and Agreement ID are required" }
            });
            return;
        }
        console.log("Affirming account with ID:", accountId, "and agreement ID:", agreementId);
        const result = await ascend_1.apexascend.enrollmentsAndAgreements.affirmAgreements({
            accountAgreementIds: [
                agreementId
            ],
        }, accountId);
        console.log("Account affirmed successfully:", JSON.stringify(result, null, 2));
        res.json({
            success: true,
            data: result
        });
    }
    catch (error) {
        console.error("Error affirming account:", error);
        res.status(500).json({
            success: false,
            error: {
                message: error.message,
                details: ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || "No additional error details available"
            }
        });
    }
});
exports.default = router;
//# sourceMappingURL=affirmAccount.js.map