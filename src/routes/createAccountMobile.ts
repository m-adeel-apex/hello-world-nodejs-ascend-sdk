import { Router, Request, Response } from "express";
import path from "path";
import fs from "fs";
import apexascend from "../utils/ascend";

const router = Router();

// Define the path to the JSON file
const createAccountJSONPath = path.join(__dirname, "..", "assets", "data", "createAccount.json");

// Function to load the create account payload
const loadCreateAccountPayload = async () => {
    try {
        // Check if the JSON file exists
        if (!fs.existsSync(createAccountJSONPath)) {
            throw new Error(`JSON file not found at: ${createAccountJSONPath}`);
        }

        // Read the JSON file
        const jsonString = fs.readFileSync(createAccountJSONPath, "utf8");
        const createAccountPayload = JSON.parse(jsonString);
        
        console.log("Loaded create account payload:", JSON.stringify(createAccountPayload, null, 2));
        return createAccountPayload;
    } catch (error) {
        console.error("Error loading create account payload:", error);
        throw error;
    }
};

// Serve the payload
router.get("/payload", async (req: Request, res: Response) => {
    console.log('GET /createAccountMobile/payload - Attempting to serve payload');
    try {
        const payload = await loadCreateAccountPayload();
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
    console.log('GET /createAccountMobile - Rendering Create Account Mobile template');
    res.render('createAccountMobile');
});

router.post("/", async (req: Request, res: Response) => {
    try {
        // Debug: Log the entire request body
        console.log("Request body:", req.body);
        console.log("Request headers:", req.headers);
        
        // Get the payload from the request body
        const payload = req.body;
        console.log("Payload: ", payload);
        
        if (!payload) {
            throw new Error("No payload provided in request body");
        }

        console.log("Creating account with payload:", JSON.stringify(payload, null, 2));
        
        const result = await apexascend.accountCreation.createAccount(payload);
        console.log("Account successfully created:", JSON.stringify(result, null, 2));

        res.json({ 
            success: true, 
            data: result
        });
    } catch (error: any) {
        console.error("Error creating account:", error);
        res.status(500).json({ 
            success: false, 
            error: {
                message: error.message || "Failed to create account",
                details: error.response?.data || null
            }
        });
    }
});

export default router; 