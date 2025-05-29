import { Router, Request, Response } from "express";

const router = Router();

// Serve the home page
router.get("/", (req: Request, res: Response) => {
  res.render('home');
});

export default router;