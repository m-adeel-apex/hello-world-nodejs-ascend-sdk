import { Request, Response, Router } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.send("<h1>Contact Us</h1><p>Feel free to reach out!</p>");
});

export default router;