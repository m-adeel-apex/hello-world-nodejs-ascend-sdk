import { Router, Request, Response } from "express";
import path from "path";
import fs from "fs";
import apexascend from "../utils/ascend";

const router = Router();

// Define the path to the JSON file
const createBankRelationshipJSONPath = path.join(__dirname, "..", "assets", "data", "createBankRelationship.json");

// Function to load the create bank relationship payload
const loadBankRelationshipPayload = async () => {
    try {
        // Check if the JSON file exists
        if (!fs.existsSync(createBankRelationshipJSONPath)) {
            throw new Error(`JSON file not found at: ${createBankRelationshipJSONPath}`);
        }

        // Read the JSON file
        const jsonString = fs.readFileSync(createBankRelationshipJSONPath, "utf8");
        const bankRelationshipPayload = JSON.parse(jsonString);
        
        console.log("Loaded bank relationship payload:", JSON.stringify(bankRelationshipPayload, null, 2));
        return bankRelationshipPayload;
    } catch (error) {
        console.error("Error loading bank relationship payload:", error);
        throw error;
    }
};

// Function to generate random routing and account numbers
const generateRandomNumberString = (length: number): string => {
    return Math.random().toString().slice(2, 2 + length);
};

// Function to update bank account details with random numbers
const updateBankAccountDetails = async () => {
    try {
        const payload = await loadBankRelationshipPayload();
        
        // Generate random routing number (9 digits) and account number (10 digits)
        const routingNumber = generateRandomNumberString(9);
        const accountNumber = generateRandomNumberString(10);
        
        // Update the payload with generated numbers
        if (payload.bankAccount) {
            payload.bankAccount.routingNumber = routingNumber;
            payload.bankAccount.accountNumber = accountNumber;
        }
        
        console.log("Updated bank relationship payload with random numbers:", JSON.stringify(payload, null, 2));
        return payload;
    } catch (error) {
        console.error("Error updating bank account details:", error);
        throw error;
    }
};

// Serve the payload
router.get("/payload", async (req: Request, res: Response) => {
    console.log('GET /createBankRelationshipMobile/payload - Attempting to serve payload');
    try {
        const payload = await updateBankAccountDetails();
        console.log('Successfully loaded payload:', JSON.stringify(payload, null, 2));
        
        // Set proper headers
        res.setHeader('Content-Type', 'application/json');
        res.json(payload);
    } catch (error: any) {
        console.error('Error serving payload:', error);
        res.status(500).json({
            success: false,
            error: {
                message: error.message
            }
        });
    }
});

router.get("/", (req: Request, res: Response) => {
    console.log('GET /createBankRelationshipMobile - Rendering Create Bank Relationship Mobile template');
    res.render('createBankRelationshipMobile');
});

router.post("/", async (req: Request, res: Response) => {
    try {
        // Debug: Log the entire request body
        console.log("Request body:", req.body);
        console.log("Request headers:", req.headers);
        
        // Get accountId from request body or query parameters
        const accountId = req.body.accountId || req.query.accountId;
        
        if (!accountId) {
            throw new Error("Account ID is required");
        }

        console.log("Using Account ID:", accountId);
        
        try {
            // Load the payload from JSON file with updated bank account details
            const payload = await updateBankAccountDetails();
            console.log("Using payload for bank relationship creation:", JSON.stringify(payload, null, 2));

            const result = await apexascend.bankRelationships.createBankRelationship(payload, accountId);

            const bankRelationship = result.bankRelationship;
            console.log("Bank Relationship successfully created:", JSON.stringify(bankRelationship, null, 2));

            res.json({ 
                success: true, 
                data: bankRelationship
            });
        } catch (apiError: any) {
            console.error("API Error creating Bank Relationship:", apiError);
            res.status(500).json({ 
                success: false, 
                error: {
                    message: apiError.message || "Failed to create bank relationship",
                    details: apiError.response?.data || null
                }
            });
        }
    } catch (error: any) {
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

export default router; 