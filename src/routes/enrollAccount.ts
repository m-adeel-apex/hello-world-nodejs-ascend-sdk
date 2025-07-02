import { Router, Request, Response } from "express";
//import { Apexascend } from "@apexfintechsolutions/ascend-sdk";
import { EnrollmentCreateType } from "@apexfintechsolutions/ascend-sdk/models/components";
//import path from "path";
import apexascend from "../utils/ascend";

const router = Router();

// Serve the enrollment page with embedded HTML
router.get("/", (_req: Request, res: Response) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Direct Account Enrollment</title>
        <link rel="stylesheet" href="/assets/styles/main.css">
        <link rel="stylesheet" href="/assets/styles/loader.css">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <div class="loader-overlay">
            <div class="loader"></div>
        </div>

        <div class="container">
            <div class="header">
                <h1>Direct Account Enrollment</h1>
                <a href="/" class="btn btn-secondary">Back to Home</a>
            </div>

            <div class="card">
                <div class="card-body">
                    <h3>Enrollment Payload</h3>
                    <div class="mb-3">
                        <label for="accountIdInput" class="form-label">Account ID (auto-populated from localStorage)</label>
                        <input type="text" id="accountIdInput" class="form-control" readonly>
                    </div>
                    <div class="mb-3">
                        <textarea id="payloadInput" class="form-control" rows="10" placeholder="Enter enrollment payload JSON">{
    "principalApproverId": "01JHG8NGTPWEJMQAB53HCANGEM",
    "type": "REGISTRATION_INDIVIDUAL",
    "consentMethod": "ESIGNATURE"
}</textarea>
                    </div>
                    <button id="enrollBtn" class="btn btn-primary" onclick="enrollAccount()">Enroll Account</button>
                </div>
            </div>

            <div class="card mt-4">
                <div class="card-body">
                    <h3>Response</h3>
                    <pre id="responseArea" class="bg-light p-3 rounded"></pre>
                </div>
            </div>
        </div>

        <script>
            const loaderOverlay = document.querySelector('.loader-overlay');
            const enrollBtn = document.getElementById('enrollBtn');
            const responseArea = document.getElementById('responseArea');
            const accountIdInput = document.getElementById('accountIdInput');

            function getStoredAccountId() {
                try {
                    const localData = localStorage.getItem('createAccountResponse');
                    if (localData) {
                        const parsedLocalData = JSON.parse(localData);
                        console.log("createAccountResponse:", parsedLocalData);
                        if (parsedLocalData?.data?.account?.accountId) {
                            return parsedLocalData.data.account.accountId;
                        }
                    }
                    return null;
                } catch (error) {
                    console.error('Error reading from storage:', error);
                    return null;
                }
            }

            // Auto-populate account ID on page load
            const storedAccountId = getStoredAccountId();
            if (storedAccountId) {
                accountIdInput.value = storedAccountId;
                console.log("Auto-populated Account ID:", storedAccountId);
            } else {
                console.log("No Account ID found in localStorage");
            }

            function toggleLoader(show) {
                if (show) {
                    loaderOverlay.classList.add('active');
                    enrollBtn.disabled = true;
                } else {
                    loaderOverlay.classList.remove('active');
                    enrollBtn.disabled = false;
                }
            }

            async function enrollAccount() {
                try {
                    const accountId = accountIdInput.value.trim();
                    console.log("Frontend - accountId from input:", accountId);
                    console.log("Frontend - accountId type:", typeof accountId);
                    console.log("Frontend - accountId length:", accountId ? accountId.length : 0);
                    
                    if (!accountId) {
                        responseArea.textContent = 'Error: No Account ID available. Please create an account first.';
                        return;
                    }

                    const payloadText = document.getElementById('payloadInput').value.trim();
                    if (!payloadText) {
                        responseArea.textContent = 'Error: Please enter a payload';
                        return;
                    }

                    const payload = JSON.parse(payloadText);
                    console.log("Frontend - parsed payload:", payload);

                    const requestBody = {
                        ...payload,
                        accountId: accountId
                    };
                    console.log("Frontend - final request body:", requestBody);

                    toggleLoader(true);
                    responseArea.textContent = 'Enrolling account...';

                    const response = await fetch('/enrollAccount', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(requestBody)
                    });

                    const result = await response.json();
                    
                    if (result.success) {
                        responseArea.textContent = JSON.stringify(result.data, null, 2);
                        localStorage.setItem('enrollAccountResponse', JSON.stringify(result));
                    } else {
                        responseArea.textContent = 'Error: ' + JSON.stringify(result.error, null, 2);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    responseArea.textContent = 'Error: ' + (error.message || 'Invalid JSON payload');
                } finally {
                    toggleLoader(false);
                }
            }
        </script>
    </body>
    </html>
    `;
    res.send(html);
});

// Handle enrollment request
router.post("/", async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Received request body:", req.body);
        const { principalApproverId, accountId } = req.body;

        console.log("Extracted principalApproverId:", principalApproverId);
        console.log("Extracted accountId:", accountId);
        console.log("accountId type:", typeof accountId);
        console.log("accountId length:", accountId ? accountId.length : 0);

        if (!principalApproverId) {
            res.status(400).json({
                success: false,
                error: "Principal Approver ID is required"
            });
            return;
        }

        if (!accountId || accountId.trim() === '') {
            res.status(400).json({
                success: false,
                error: "Account ID is required and cannot be empty"
            });
            return;
        }

        const trimmedAccountId = accountId.trim();
        console.log("Using Principal Approver ID:", principalApproverId);
        console.log("Using Account ID:", trimmedAccountId);

        const result = await apexascend.enrollmentsAndAgreements.enrollAccount({
            enrollment: {
                principalApproverId: principalApproverId,
                type: EnrollmentCreateType.RegistrationIndividual,
            },
        }, trimmedAccountId);

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