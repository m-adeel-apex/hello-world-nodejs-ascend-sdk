import { Router, Request, Response } from "express";
import path from "path";
import fs from "fs";


import apexascend from "../utils/ascend";

const router = Router();
// Define the path to the centralized JSON file
const createBankRelationshipJSONPath = path.join(__dirname, "..", "assets", "data", "createBankRelationship.json");
console.log("createBankRelationshipJSONPath", createBankRelationshipJSONPath);

// Function to generate random number string with specified length
const generateRandomNumberString = (length: number): string => {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10).toString();
    }
    return result;
};

// Function to validate US routing number using checksum algorithm
const isValidRoutingNumber = (routingNumber: string): boolean => {
    if (routingNumber.length !== 9) return false;
    
    const weights = [3, 7, 1, 3, 7, 1, 3, 7, 1];
    let sum = 0;
    
    for (let i = 0; i < 9; i++) {
        sum += parseInt(routingNumber[i]) * weights[i];
    }
    
    return sum % 10 === 0;
};

// Function to generate valid US routing number
const generateRandomRoutingNumber = (): string => {
    let routingNumber: string;
    do {
        // Generate first 8 digits randomly
        const first8Digits = generateRandomNumberString(8);
        // Calculate the 9th digit to make it valid
        const weights = [3, 7, 1, 3, 7, 1, 3, 7];
        let sum = 0;
        
        for (let i = 0; i < 8; i++) {
            sum += parseInt(first8Digits[i]) * weights[i];
        }
        
        // Calculate the check digit (9th digit)
        const checkDigit = (10 - (sum % 10)) % 10;
        routingNumber = first8Digits + checkDigit.toString();
        
    } while (!isValidRoutingNumber(routingNumber));
    
    return routingNumber;
};

// Function to generate random account number (10 digits)
const generateRandomAccountNumber = (): string => {
    return generateRandomNumberString(10);
};

// Function to load and update the payload with random numbers
const loadBankRelationshipPayload = async () => {
    try {
        // Check if the JSON file exists
        if (!fs.existsSync(createBankRelationshipJSONPath)) {
            throw new Error(`JSON file not found at: ${createBankRelationshipJSONPath}`);
        }

        // Read the JSON file
        const jsonString = fs.readFileSync(createBankRelationshipJSONPath, "utf8");
        const bankRelationshipPayload = JSON.parse(jsonString);
        
        // Generate random routing and account numbers
        //const randomRoutingNumber = generateRandomRoutingNumber();
      //  const routingNumber = generateRandomRoutingNumber();
       const randomAccountNumber = generateRandomAccountNumber();
        
        // Update the payload with random numbers
        //bankRelationshipPayload.bankAccount.routingNumber = randomRoutingNumber;
        bankRelationshipPayload.bankAccount.accountNumber = randomAccountNumber;
        //bankRelationshipPayload.bankAccount.routingNumber = routingNumber;
        
        //console.log("Generated random routing number:", randomRoutingNumber);
        //console.log("Generated random account number:", randomAccountNumber);
        console.log("Updated bank relationship payload:", JSON.stringify(bankRelationshipPayload, null, 2));
        
        return bankRelationshipPayload;
    } catch (error) {
        console.error("Error loading bank relationship payload:", error);
        throw error;
    }
};

// Serve the payload
router.get("/payload", async (req: Request, res: Response) => {
    console.log('GET /createBankRelationship/payload - Attempting to serve payload');
    try {
        const payload = await loadBankRelationshipPayload();
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
    console.log('GET /createBankRelationship - Rendering Create Bank Relationship template');
    res.render('createBankRelationship');
});

router.post("/", async (req: Request, res: Response) => {
    try {
        // Get accountId from request body or query parameters
        const accountId = req.body.accountId || req.query.accountId;
        
        if (!accountId) {
            throw new Error("Account ID is required");
        }

        console.log("Using Account ID:", accountId);
        
        try {
            // Load the payload from JSON file
            const payload = await loadBankRelationshipPayload();
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

