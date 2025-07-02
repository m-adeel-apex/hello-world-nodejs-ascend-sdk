import { Router, Request, Response } from "express";
import path from "path";
import fs from "fs";
import apexascend from "../utils/ascend";
import { RouteType, TradeCreateAssetType, TradeCreateBrokerCapacity, TradeCreateIdentifierType, TradeCreateSide } from "@apexfintechsolutions/ascend-sdk/models/components";

const router = Router();

// Define the path to the JSON file
const tradeBookingJSONPath = path.join(__dirname, "..", "assets", "data", "tradeBooking.json");

// Function to load the trade booking payload
const loadTradeBookingPayload = async () => {
    try {
        // Check if the JSON file exists
        if (!fs.existsSync(tradeBookingJSONPath)) {
            throw new Error(`JSON file not found at: ${tradeBookingJSONPath}`);
        }

        // Read the JSON file
        const jsonString = fs.readFileSync(tradeBookingJSONPath, "utf8");
        const tradeBookingPayload = JSON.parse(jsonString);

        console.log("Loaded trade booking payload:", JSON.stringify(tradeBookingPayload, null, 2));
        return tradeBookingPayload;
    } catch (error) {
        console.error("Error loading trade booking payload:", error);
        throw error;
    }
};

// Serve the payload
router.get("/payload", async (req: Request, res: Response) => {
    console.log('GET /tradeBooking/payload - Attempting to serve payload');
    try {
        const payload = await loadTradeBookingPayload();
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
    console.log('GET /tradeBooking - Rendering Trade Booking template');
    res.render('tradeBooking');
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
        try {
            console.log("Account ID:", accountId);

            // Debug: Check available methods
            console.log("Available methods on apexascend:", Object.keys(apexascend));
            
            // Check if tradeBooking exists
            if (!apexascend.tradeBooking) {
                throw new Error("Trade booking functionality is not available. Available methods: " + Object.keys(apexascend).join(", "));
            }

            const result = await apexascend.tradeBooking.createTrade({
                accountId: accountId,
                brokerCapacity: TradeCreateBrokerCapacity.Agency,
                clientOrderId: "00be5285-0623-4560-8c58-f05af2c56ba0",
                executions: [
                    {
                        executionTime: new Date("2024-07-17T12:00:00Z"),
                        externalId: "0H06HAP3A3Y",
                        price: {
                            value: "25.000000"
                        },
                        quantity: {
                            value: "1.000000"
                        }
                    }
                ],
                identifier: "AAPL",
                identifierType: TradeCreateIdentifierType.Symbol,
                routeType: RouteType.Mngd,
                side: TradeCreateSide.Buy,
                assetType: TradeCreateAssetType.Equity,
                sourceApplication: "Trading-App"
            }, accountId);

            res.json({
                success: true,
                data: result
            });
        } catch (apiError: any) {
            console.error("API Error creating trade:", apiError);
            res.status(500).json({
                success: false,
                error: {
                    message: apiError.message || "Failed to create trade",
                    details: apiError.response?.data || null
                }
            });
        }
    } catch (error: any) {
        console.error("Error creating trade:", error);
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



