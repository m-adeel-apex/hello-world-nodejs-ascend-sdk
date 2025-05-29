import { Router, Request, Response } from "express";
import path from "path";
import fs from "fs";
//import { Apexascend } from "@apexfintechsolutions/ascend-sdk";
//import { VerificationMethod } from "@apexfintechsolutions/ascend-sdk/models/components";
import apexascend from "../utils/ascend";


const router = Router();
// Define the path to the centralized JSON file
const createBankRelationshipJSONPath = path.join(__dirname, "..", "assets", "data", "createBankRelationship.json");

const updateBankAccountDetails = async () => {
    try {
        // Check if the JSON file exists
        if (!fs.existsSync(createBankRelationshipJSONPath)) {
            throw new Error(`JSON file not found at: ${createBankRelationshipJSONPath}`);
        }

        // Read the JSON file
        const jsonString = fs.readFileSync(createBankRelationshipJSONPath, "utf8");
        const bankRelationshipPayload = JSON.parse(jsonString);

        // Generate random values for routingNumber and accountNumber
        const routingNumber = generateRandomNumberString(9); // Routing number as 9 digits
        const accountNumber = generateRandomNumberString(10); // Account number as 10 digits

        // Update the bankAccount object
        bankRelationshipPayload.bankAccount.routingNumber = routingNumber;
        bankRelationshipPayload.bankAccount.accountNumber = accountNumber;

        // Save the updated JSON back to the file
        fs.writeFileSync(createBankRelationshipJSONPath, JSON.stringify(bankRelationshipPayload, null, 2));
        console.log("Updated JSON successfully saved:", createBankRelationshipJSONPath);

        return bankRelationshipPayload; // Return the updated JSON object
    } catch (error) {
        console.error("Error updating bank account details:", error);
        throw error;
    }
};
/**
* Helper function to generate random numeric strings of a given length
*/
const generateRandomNumberString = (length: number): string => {
    let result = "";
    const digits = "0123456789";
    for (let i = 0; i < length; i++) {
        result += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return result;
};

// Replace values and log the result
const getBankRelationshipJSONPath = path.join(__dirname, "..", "assets", "data", "createBankRelationship.json");
console.log('JSON Payload Path:', getBankRelationshipJSONPath);

const createBankRelationshipPayload = (): any => {
    try {
        console.log('Checking file exists at:', getBankRelationshipJSONPath);
        if (!fs.existsSync(getBankRelationshipJSONPath)) {
            console.error(`File not found: ${getBankRelationshipJSONPath}`);
            throw new Error("Payload file not found");
        }
        console.log('Reading file...');
        const payload = JSON.parse(fs.readFileSync(getBankRelationshipJSONPath, "utf8"));
        console.log('Successfully parsed payload');
        return payload;
    } catch (error) {
        console.error("Error reading create Account payload:", error);
        throw error;
    }
};
// Serve the payload
router.get("/payload", (req: Request, res: Response) => {
    console.log('GET /payload - Attempting to serve payload');
    try {
        console.log("Reading payload from:", getBankRelationshipJSONPath);
        const payload = createBankRelationshipPayload();
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

updateBankAccountDetails()
.then((updatedPayload) => {
    console.log("Updated Payload:", JSON.stringify(updatedPayload, null, 2));
})
.catch((err) => {
    console.error("Failed to update bank account details:", err);
});

router.get("/", (req: Request, res: Response) => {
console.log('GET / - Rendering Create Bank Relationship template');
res.render('createBankRelationship');
});

router.post("/", async (_req: Request, res: Response) => {
    try {
        let accountId = "";
        const storedCreateAccount = localStorage.getItem("createAccountResponse");

        if (storedCreateAccount) {
            const parsedAccount = JSON.parse(storedCreateAccount);
            if (parsedAccount && parsedAccount.data && parsedAccount.data.account && parsedAccount.data.account.accountId) {
                accountId = parsedAccount.data.account.accountId; // Use stored accountId
            } else {
                console.log("Invalid format in localStorage, generating random Account ID...");
                accountId = "01H8FB90ZRRFWXB4XC2JPJ1D4Y"; // Example random accountId
            }
        } else {
            console.log("No Account ID found in localStorage, generating random Account ID...");
            accountId = "01H8FB90ZRRFWXB4XC2JPJ1D4Y"; // Example random accountId
        }

        console.log("Using Account ID:", accountId);
      const updatedPayload = await updateBankAccountDetails();
      console.log("Updated createBankRelationship payload:", JSON.stringify(updatedPayload, null, 2));
  
      const result = await apexascend.bankRelationships.createBankRelationship(updatedPayload, accountId);
      console.log("Bank Relationship successfully created:", JSON.stringify(result, null, 2));
  
      res.json({ success: true, data: result });
    } catch (error) {
      console.error("Error creating Bank Relationship:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

export default router;

