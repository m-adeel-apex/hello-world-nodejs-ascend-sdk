import { Router, Request, Response } from "express";
import path from "path";
import fs from "fs";
import apexascend from "../utils/ascend";

const router = Router();

// Define the path to the JSON file
const legalNaturalPersonJSONPath = path.join(__dirname, "..", "assets", "data", "createLegalNaturalPerson.json");

// Function to load the legal natural person payload
const loadLegalNaturalPersonPayload = async () => {
    try {
        // Check if the JSON file exists
        if (!fs.existsSync(legalNaturalPersonJSONPath)) {
            throw new Error(`JSON file not found at: ${legalNaturalPersonJSONPath}`);
        }

        // Read the JSON file
        const jsonString = fs.readFileSync(legalNaturalPersonJSONPath, "utf8");
        const legalNaturalPersonPayload = JSON.parse(jsonString);
        
        console.log("Loaded legal natural person payload:", JSON.stringify(legalNaturalPersonPayload, null, 2));
        return legalNaturalPersonPayload;
    } catch (error) {
        console.error("Error loading legal natural person payload:", error);
        throw error;
    }
};

// Serve the payload
router.get("/payload", async (req: Request, res: Response) => {
    console.log('GET /legalNaturalPersonMobile/payload - Attempting to serve payload');
    try {
        const payload = await loadLegalNaturalPersonPayload();
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
    console.log('GET /legalNaturalPersonMobile - Rendering Mobile Legal Natural Person template');
    res.render('legalNaturalPersonMobile');
});

router.post("/", async (req: Request, res: Response) => {
    try {
        // Load the payload from JSON file
        const payload = await loadLegalNaturalPersonPayload();
        console.log("Using payload for legal natural person creation:", JSON.stringify(payload, null, 2));

        const result = await apexascend.personManagement.createLegalNaturalPerson(payload);

        console.log("Legal Natural Person successfully created:", JSON.stringify(result, null, 2));

        res.json({ 
            success: true, 
            data: result
        });
    } catch (error: any) {
        console.error("Error creating Legal Natural Person:", error);
        res.status(500).json({ 
            success: false, 
            error: {
                message: error.message || "Failed to create legal natural person",
                details: error.response?.data || null
            }
        });
    }
});

export default router; 