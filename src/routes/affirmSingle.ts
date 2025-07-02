import express from 'express';
import apexascend from "../utils/ascend";

const router = express.Router();

// GET route for the affirmSingle page
router.get('/', (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Affirm Agreements</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            .loading-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.8);
                z-index: 1000;
            }
            .spinner-container {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            #responseContainer {
                display: none;
                margin-top: 20px;
            }
            pre {
                background-color: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
                max-height: 400px;
                overflow-y: auto;
            }
        </style>
    </head>
    <body>
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h3 class="mb-0">Affirm Agreements</h3>
                            <a href="/" class="btn btn-secondary">Back to Home</a>
                        </div>
                        <div class="card-body">
                            <form id="affirmAccountForm">
                                <div class="mb-3">
                                    <label for="accountId" class="form-label">Account ID</label>
                                    <input type="text" class="form-control" id="accountId" required>
                                </div>
                                <div class="mb-3">
                                    <label for="agreementIds" class="form-label">Agreement IDs (comma-separated)</label>
                                    <input type="text" class="form-control" id="agreementIds" required>
                                </div>
                                <button type="submit" class="btn btn-primary" id="affirmAccountBtn">Affirm Agreements</button>
                            </form>

                            <div id="responseContainer" class="mt-4">
                                <h4>Response:</h4>
                                <pre id="responseArea"></pre>
                            </div>

                            <div id="storedResponseContainer" class="mt-4" style="display: none;">
                                <h4>Stored Affirmation Response:</h4>
                                <pre id="storedResponseArea"></pre>
                                <div class="mt-2">
                                    <button class="btn btn-secondary btn-sm" onclick="clearStoredResponse()">Clear Stored Response</button>
                                    <button class="btn btn-info btn-sm ms-2" onclick="downloadResponse()">Download Response</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="loading-overlay">
            <div class="spinner-container">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>

        <script>
            function toggleLoader(show) {
                document.querySelector('.loading-overlay').style.display = show ? 'block' : 'none';
            }

            function displayResponse(response) {
                const responseContainer = document.getElementById('responseContainer');
                const responseArea = document.getElementById('responseArea');
                responseContainer.style.display = 'block';
                responseArea.textContent = JSON.stringify(response, null, 2);
            }

            function downloadResponse() {
                const responseArea = document.getElementById('responseArea');
                const responseText = responseArea.textContent;
                const blob = new Blob([responseText], { type: 'application/json' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'affirmation_response.json';
                link.click();
                URL.revokeObjectURL(link.href);
            }
            function getStoredAccountId() {
                try {
                    // Get Account ID from createAccountResponse (localStorage)
                    const createData = localStorage.getItem('createAccountResponse');
                    if (createData) {
                        const parsedCreateData = JSON.parse(createData);
                        console.log("Full createAccountResponse:", parsedCreateData);
                        
                        if (parsedCreateData?.data?.account?.accountId) {
                            console.log("Found accountId from createAccount:", parsedCreateData.data.account.accountId);
                            return parsedCreateData.data.account.accountId;
                        }
                    }
                    
                    console.log("No accountId found in createAccountResponse");
                    return null;
                } catch (error) {
                    console.error('Error reading from storage:', error);
                    return null;
                }
            }

            function getStoredAgreementId() {
                try {
                    // Get from enrollment response (localStorage)
                    const enrollData = localStorage.getItem('enrollAccountResponse');
                    if (enrollData) {
                        const parsedEnrollData = JSON.parse(enrollData);
                        console.log("Full enrollAccountResponse:", parsedEnrollData);
                        
                        // Check for agreements in enrollment response
                        const agreements = parsedEnrollData?.data?.enrollAccountResponse?.agreements || [];
                        console.log("Found agreements:", agreements);
                        
                        if (agreements.length > 0) {
                            const agreementIds = agreements.map(agreement => agreement.agreementId).join(',');
                            console.log("Returning agreementIds:", agreementIds);
                            return agreementIds;
                        }
                    }
                    
                    console.log("No agreementIds found in enrollAccountResponse");
                    return null;
                } catch (error) {
                    console.error('Error reading from storage:', error);
                    return null;
                }
            }

            // Initialize page
         

            // Pre-fill account ID and agreement IDs if available
            const accountIdInput = document.getElementById('accountId');
            const agreementIdsInput = document.getElementById('agreementIds');

            // Set the account ID (from createAccountResponse)
            const storedAccountId = getStoredAccountId();
            console.log("Retrieved storedAccountId:", storedAccountId);
            if (storedAccountId && typeof storedAccountId === 'string') {
                accountIdInput.value = storedAccountId;
                console.log("Set accountId input value to:", storedAccountId);
            } else {
                console.log("No valid accountId found, leaving field empty");
            }

            // Set the agreement IDs (from enrollAccountResponse)
            const storedAgreementId = getStoredAgreementId();
            console.log("Retrieved storedAgreementId:", storedAgreementId);
            if (storedAgreementId && typeof storedAgreementId === 'string') {
                agreementIdsInput.value = storedAgreementId;
                console.log("Set agreementIds input value to:", storedAgreementId);
            } else {
                console.log("No valid agreementIds found, leaving field empty");
            }

            // Handle form submission
            document.getElementById('affirmAccountForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                toggleLoader(true);
                document.getElementById('responseContainer').style.display = 'none';

                try {
                    const accountIdInput = document.getElementById('accountId');
                    const agreementIdsInput = document.getElementById('agreementIds').value;
                    const agreementIds = agreementIdsInput.split(',')
                        .map(id => id.trim())
                        .filter(id => id)
                        .map(id => id.replace(/^["']|["']$/g, ''));

                    const response = await fetch('/affirmSingle', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            accountId: accountIdInput.value,
                            accountAgreementIds: agreementIds
                        })
                    });

                    const result = await response.json();
                    displayResponse(result);

                    if (!response.ok) {
                        throw new Error(result.error?.message || 'Failed to affirm agreements');
                    }

                    if (result.success) {
                        // Save the complete response to localStorage
                        const responseToStore = {
                            success: true,
                            timestamp: new Date().toISOString(),
                            accountId: accountIdInput.value,
                            agreementIds: agreementIds,
                            data: result.data,
                            message: "Agreements affirmed successfully!"
                        };
                        
                        localStorage.setItem('affirmAccountResponse', JSON.stringify(responseToStore));
                        console.log("Response saved to localStorage:", responseToStore);
                        
                        // Update the stored response display
                       
                        
                        // Show success message
                        displayResponse({
                            success: true,
                            message: "Agreements affirmed successfully!",
                            data: result.data,
                            storedIn: "affirmAccountResponse",
                            timestamp: responseToStore.timestamp
                        });
                    } else {
                        displayResponse(result);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    displayResponse({
                        success: false,
                        error: {
                            message: error.message
                        }
                    });
                } finally {
                    toggleLoader(false);
                }
            });
        </script>
    </body>
    </html>
    `;
    res.send(html);
});

// POST route for affirming agreements
router.post('/', async (req, res) => {
    try {
        const { accountId, accountAgreementIds } = req.body;
        console.log("Received request - accountId:", accountId);
        console.log("Received request - accountAgreementIds:", accountAgreementIds);
        
        if (!accountId) {
            res.status(400).json({
                success: false,
                error: "Account ID is required"
            });
            return;
        }

        if (!accountAgreementIds || !Array.isArray(accountAgreementIds) || accountAgreementIds.length === 0) {
            res.status(400).json({
                success: false,
                error: "At least one Agreement ID is required"
            });
            return;
        }

        // Clean and format each agreement ID
        const formattedAgreementIds = accountAgreementIds.map(id => id.trim());

        // Create the agreements object
        const agreementsObject = {
            accountAgreementIds: formattedAgreementIds
        };

        console.log("Using Agreement IDs:", formattedAgreementIds);
        console.log("Account ID:", accountId);
        console.log("Agreements Object:", JSON.stringify(agreementsObject, null, 2));

        const result = await apexascend.enrollmentsAndAgreements.affirmAgreements(agreementsObject, accountId);

        console.log("Affirmation result:", JSON.stringify(result, null, 2));

        res.json({
            success: true,
            data: result
        });

    } catch (error: any) {
        console.error("Error affirming agreements:", error);
        console.error("Error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        
        res.status(500).json({
            success: false,
            error: {
                message: error.message || "An error occurred during affirmation",
                details: error.response?.data || null,
                status: error.response?.status || null
            }
        });
    }
});

export default router; 









