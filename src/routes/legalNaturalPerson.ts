import { Request, Response, Router } from "express";
import path from "path";
import fs from "fs";
//import { Apexascend } from "@apexfintechsolutions/ascend-sdk";
import apexascend from "../utils/ascend"

const router = Router();

// Centralized JSON payload path
const legalNaturalPersonJSONPath = path.join(__dirname, "..", "assets", "data", "createLegalNaturalPerson.json");
console.log('JSON Payload Path:', legalNaturalPersonJSONPath);


// Load JSON payload
const getLegalNaturalPersonPayload = (): any => {
  try {
    console.log('Checking file exists at:', legalNaturalPersonJSONPath);
    if (!fs.existsSync(legalNaturalPersonJSONPath)) {
      console.error(`File not found: ${legalNaturalPersonJSONPath}`);
      throw new Error("Payload file not found");
    }
    console.log('Reading file...');
    const payload = JSON.parse(fs.readFileSync(legalNaturalPersonJSONPath, "utf8"));
    console.log('Successfully parsed payload');
    return payload;
  } catch (error) {
    console.error("Error reading legal natural person payload:", error);
    throw error;
  }
};

// Serve the Legal Natural Person page
router.get("/", (req: Request, res: Response) => {
  console.log('GET / - Rendering legalNaturalPerson template');
  res.render('legalNaturalPerson');
});

// Serve the payload
router.get("/payload", (req: Request, res: Response) => {
  console.log('GET /payload - Attempting to serve payload');
  try {
    console.log("Reading payload from:", legalNaturalPersonJSONPath);
    const payload = getLegalNaturalPersonPayload();
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

// Handle the POST request for Legal Natural Person submission
router.post("/", async (_req: Request, res: Response) => {
  try {
    const payloadPath = path.join(__dirname, "../assets/data/createLegalNaturalPerson.json");
    const payload = JSON.parse(fs.readFileSync(payloadPath, "utf-8"));

    console.log("Creating legal natural person with payload:", JSON.stringify(payload, null, 2));
    
    //const apexascend = new Apexascend();
    const result = await apexascend.personManagement.createLegalNaturalPerson(payload);
    console.log("Legal natural person creation successful:", JSON.stringify(result, null, 2));
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error creating legal natural person:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;