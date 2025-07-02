import { Router, Request, Response } from "express";
import apexascend from "../utils/ascend";
import { EnrollmentCreateType, EnrollmentCreateConsentMethod } from "@apexfintechsolutions/ascend-sdk/models/components";
import path from "path";

const router = Router();

// Serve the enrollment page
router.get("/", (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '..', 'templates', 'getEnroll.html'));
});

// Handle enrollment request
router.post("/", async (req: Request, res: Response): Promise<void> => {
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
        const consentMethodValue = consentMethod || EnrollmentCreateConsentMethod.Esignature;
        const enrollmentTypeValue = enrollmentType || EnrollmentCreateType.RegistrationIndividual;
        const formattedAccountId = accountId.startsWith('accounts/') ? accountId : `accounts/${accountId}`;
        console.log("Using Account ID:", formattedAccountId);
        console.log("Using Principal Approver ID:", principalApproverId);
        console.log("Using Consent Method:", consentMethodValue);
        console.log("Using Enrollment Type:", enrollmentTypeValue);

        // Get account details first
        const accountDetails = await apexascend.accountCreation.getAccount(formattedAccountId);
        console.log("Account details:", JSON.stringify(accountDetails, null, 2));

        // Get the legalNaturalPersonId from account details
        //const legalNaturalPersonId = accountDetails.account?.parties?.[0]?.legalNaturalPerson?.legalNaturalPersonId;

    /*     if (!legalNaturalPersonId) {
            return res.status(400).render('getEnroll', {
                error: "Could not find legalNaturalPersonId in account details"
            });
        } */

        // Create enrollment request
        const enrollmentRequest = {
            enrollment: {
                principalApproverId: principalApproverId,
                type: enrollmentTypeValue,
                consentMethod: consentMethodValue
            }
        };

        console.log("Enrolling account with request:", JSON.stringify(enrollmentRequest, null, 2));

        const result = await apexascend.enrollmentsAndAgreements.enrollAccount(enrollmentRequest, formattedAccountId);

        console.log("Enrollment result:", JSON.stringify(result, null, 2));

        res.json({
            success: true,
            data: result
        });

    } catch (error: any) {
        console.error("Error enrolling account:", error);

        res.status(500).json({
            success: false,
            error: {
                message: error.message || "An error occurred during enrollment",
                details: error.response?.data || null
            }
        });
    }
});

export default router;