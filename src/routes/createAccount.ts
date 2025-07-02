import { Router, Request, Response } from "express";
import path from "path";
import fs from "fs";
//import { Apexascend } from "@apexfintechsolutions/ascend-sdk";
import apexascend from "../utils/ascend";

const router = Router();

const getAccountJSONPath = path.join(__dirname, "..", "assets", "data", "createAccount.json");
console.log('JSON Payload Path:', getAccountJSONPath);

const createAccountPayload = (): any => {
  try {
    console.log('Checking file exists at:', getAccountJSONPath);
    if (!fs.existsSync(getAccountJSONPath)) {
      console.error(`File not found: ${getAccountJSONPath}`);
      throw new Error("Payload file not found");
    }
    console.log('Reading file...');
    const payload = JSON.parse(fs.readFileSync(getAccountJSONPath, "utf8"));
    console.log('Successfully parsed payload');
    console.log("Legal Natural Person ID: Coning from Typescript File", payload.parties[0].legalNaturalPersonId);
    return payload;
  } catch (error) {
    console.error("Error reading create Account payload:", error);
    throw error;
  }
};

router.get("/", (req: Request, res: Response) => {
  console.log('GET / - Rendering Create Account template');
  res.render('createAccount');
});

// Serve the payload
router.get("/payload", (req: Request, res: Response) => {
  console.log('GET /payload - Attempting to serve payload');
  try {
    console.log("Reading payload from:", getAccountJSONPath);
    const payload = createAccountPayload();
    console.log('Successfully read payload, sending response');
    res.type('application/json').send(JSON.stringify(payload));
  } catch (error: any) {
    console.error('Error serving payload:', error);
    res.status(500).type('application/json').send(JSON.stringify({ 
      success: false, 
      error: { 
        message: error.message 
      } 
    }));
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/getDetails", async (req: Request, res: Response) => {
  try {
    const { accountId } = req.body;
    
    if (!accountId) {
      res.status(400).json({ 
        success: false, 
        error: { message: "Account ID is required" }
      });
      return;
    }

    // Format account ID if needed
    const formattedAccountId = accountId.startsWith('accounts/') ? accountId : `accounts/${accountId}`;
    console.log("Getting details for account:", formattedAccountId);

    const result = await apexascend.accountCreation.getAccount(formattedAccountId);
    
    // Extract the legalNaturalPersonId from the account details
    const legalNaturalPersonId = result.account?.parties?.[0]?.legalNaturalPerson?.legalNaturalPersonId;
    
    console.log("Account details:", JSON.stringify(result, null, 2));
    res.json({ 
      success: true, 
      data: {
        ...result,
        legalNaturalPersonId // Include the legalNaturalPersonId in the response
      }
    });
  } catch (error: any) {
    console.error("Error retrieving account:", error);
    res.status(500).json({ 
      success: false, 
      error: {
        message: error.message,
        details: error.response?.data || "No additional error details available"
      }
    });
  }
});

export default router;