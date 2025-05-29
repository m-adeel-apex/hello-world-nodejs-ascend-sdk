import { Request, Response, Router } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.send("<h1>About Us</h1><p>We are extending our Hello World app into a full-featured app!</p>");
});

export default router;