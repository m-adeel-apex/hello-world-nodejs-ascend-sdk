"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.send("<h1>About Us</h1><p>We are extending our Hello World app into a full-featured app!</p>");
});
exports.default = router;
//# sourceMappingURL=about.js.map