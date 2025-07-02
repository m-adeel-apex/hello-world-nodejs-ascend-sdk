"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ascend_1 = __importDefault(require("../utils/ascend"));
const components_1 = require("@apexfintechsolutions/ascend-sdk/models/components");
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
router.get("/", (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, '..', 'templates', 'getEnroll.html'));
});
router.post("/", async (req, res) => {
    var _a;
    try {
        const { accountId, principalApproverId, consentMethod, enrollmentType } = req.body;
        if (!accountId) {
            res.status(400).json({
                success: false,
                error: "Account ID is required"
            });
            return;
        }
        if (!principalApproverId) {
            res.status(400).json({
                success: false,
                error: "Principal Approver ID is required"
            });
            return;
        }
        const consentMethodValue = consentMethod || components_1.EnrollmentCreateConsentMethod.Esignature;
        const enrollmentTypeValue = enrollmentType || components_1.EnrollmentCreateType.RegistrationIndividual;
        const formattedAccountId = accountId.startsWith('accounts/') ? accountId : `accounts/${accountId}`;
        console.log("Using Account ID:", formattedAccountId);
        console.log("Using Principal Approver ID:", principalApproverId);
        console.log("Using Consent Method:", consentMethodValue);
        console.log("Using Enrollment Type:", enrollmentTypeValue);
        const accountDetails = await ascend_1.default.accountCreation.getAccount(formattedAccountId);
        console.log("Account details:", JSON.stringify(accountDetails, null, 2));
        const enrollmentRequest = {
            enrollment: {
                principalApproverId: principalApproverId,
                type: enrollmentTypeValue,
                consentMethod: consentMethodValue
            }
        };
        console.log("Enrolling account with request:", JSON.stringify(enrollmentRequest, null, 2));
        const result = await ascend_1.default.enrollmentsAndAgreements.enrollAccount(enrollmentRequest, formattedAccountId);
        console.log("Enrollment result:", JSON.stringify(result, null, 2));
        res.json({
            success: true,
            data: result
        });
    }
    catch (error) {
        console.error("Error enrolling account:", error);
        res.status(500).json({
            success: false,
            error: {
                message: error.message || "An error occurred during enrollment",
                details: ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || null
            }
        });
    }
});
exports.default = router;
//# sourceMappingURL=getEnroll.js.map