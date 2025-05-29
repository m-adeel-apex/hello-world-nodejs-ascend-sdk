"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const home_1 = __importDefault(require("./routes/home"));
const getAccount_1 = __importDefault(require("./routes/getAccount"));
const createAccount_1 = __importDefault(require("./routes/createAccount"));
const legalNaturalPerson_1 = __importDefault(require("./routes/legalNaturalPerson"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('views', path_1.default.join(__dirname, 'templates'));
app.use('/data', express_1.default.static(path_1.default.join(__dirname, "assets/data")));
app.use('/assets', express_1.default.static(path_1.default.join(__dirname, "assets")));
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use("/", home_1.default);
app.use("/getAccount", getAccount_1.default);
app.use("/createAccount", createAccount_1.default);
app.use("/legalNaturalPerson", legalNaturalPerson_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map