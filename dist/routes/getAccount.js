"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ascend_1 = require("../utils/ascend");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.render('getAccount');
});
router.get("/getDetails", async (req, res) => {
    var _a;
    try {
        const accountId = req.query.accountId;
        if (!accountId) {
            res.status(400).json({
                success: false,
                error: { message: "Account ID is required" }
            });
            return;
        }
        const result = await ascend_1.apexascend.accountCreation.getAccount(accountId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        console.error("Error retrieving account:", error);
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
//# sourceMappingURL=getAccount.js.map