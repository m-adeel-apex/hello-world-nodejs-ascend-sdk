import { Router, Request, Response } from "express";
import { apexascend } from "../utils/ascend";


const router = Router();

// Serve the Get Account page
router.get("/", (req: Request, res: Response) => {
  res.render('getAccount');
});

// Handle GET request to fetch account details
router.get("/getDetails", async (req: Request, res: Response) => {
  try {
    const accountId = req.query.accountId as string;
  if (!accountId) {
      res.status(400).json({ 
        success: false, 
        error: { message: "Account ID is required" }
      });
    return;
  }
    const result = await apexascend.accountCreation.getAccount(accountId);
    res.json({ success: true, data: result });
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