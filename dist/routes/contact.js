"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.send("<h1>Contact Us</h1><p>Feel free to reach out!</p>");
});
exports.default = router;
//# sourceMappingURL=contact.js.map