import { Router, Request, Response } from "express";
import path from "path";
import fs from "fs";
import apexascend from "../utils/ascend";
import { AssetType, IdentifierType, OrderType, Side, TimeInForce } from "@apexfintechsolutions/ascend-sdk/models/components";

const router = Router();

// Define the path to the JSON file
const createOrderJSONPath = path.join(__dirname, "..", "assets", "data", "createOrder.json");

// Function to load the create order payload
const loadCreateOrderPayload = async () => {
    try {
        // Check if the JSON file exists
        if (!fs.existsSync(createOrderJSONPath)) {
            throw new Error(`JSON file not found at: ${createOrderJSONPath}`);
        }

        // Read the JSON file
        const jsonString = fs.readFileSync(createOrderJSONPath, "utf8");
        const createOrderPayload = JSON.parse(jsonString);
        
        console.log("Loaded create order payload:", JSON.stringify(createOrderPayload, null, 2));
        return createOrderPayload;
    } catch (error) {
        console.error("Error loading create order payload:", error);
        throw error;
    }
};

// Serve the payload
router.get("/payload", async (req: Request, res: Response) => {
    console.log('GET /createOrder/payload - Attempting to serve payload');
    try {
        const payload = await loadCreateOrderPayload();
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
    console.log('GET /createOrder - Rendering Create Order template');
    res.render('createOrder');
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

        console.log("Account ID:", accountId);

        // Debug: Check available methods
        console.log("Available methods on apexascend:", Object.keys(apexascend));
        
        // Check if createOrder exists
        if (!apexascend.createOrder) {
            throw new Error("Create order functionality is not available. Available methods: " + Object.keys(apexascend).join(", "));
        }

        // Load the payload from JSON file
        const payload = await loadCreateOrderPayload();
        
        // Update dynamic parameters
        payload.orderDate = {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDate()
        };
        
        console.log("Using payload for order creation:", JSON.stringify(payload, null, 2));

        const result = await apexascend.createOrder.createOrder(payload, accountId);

        console.log("Order successfully created:", JSON.stringify(result, null, 2));

        res.json({ 
            success: true, 
            data: result
        });
    } catch (apiError: any) {
        console.error("API Error creating order:", apiError);
        res.status(500).json({ 
            success: false, 
            error: {
                message: apiError.message || "Failed to create order",
                details: apiError.response?.data || null
            }
        });
    }
});

// Get Order endpoint
router.post("/getOrder", async (req: Request, res: Response) => {
    try {
        const { accountId, orderId } = req.body;
        
        if (!accountId) {
            throw new Error("Account ID is required");
        }
        
        if (!orderId) {
            throw new Error("Order ID is required");
        }

        console.log("Getting order details for Account ID:", accountId);
        console.log("Order ID:", orderId);

        // Check if createOrder exists
        if (!apexascend.createOrder) {
            throw new Error("Create order functionality is not available. Available methods: " + Object.keys(apexascend).join(", "));
        }

        const result = await apexascend.createOrder.getOrder(accountId, orderId);

        console.log("Order details retrieved successfully:", JSON.stringify(result, null, 2));

        res.json({ 
            success: true, 
            data: result
        });
    } catch (apiError: any) {
        console.error("API Error getting order:", apiError);
        res.status(500).json({ 
            success: false, 
            error: {
                message: apiError.message || "Failed to get order",
                details: apiError.response?.data || null
            }
        });
    }
});

export default router; 