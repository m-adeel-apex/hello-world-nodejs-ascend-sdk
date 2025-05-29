import express from "express";
import path from "path";
import homeRoutes from "./routes/home";
import getAccount from "./routes/getAccount";
import createAccountRoutes from "./routes/createAccount";
import legalNaturalPersonRoutes from "./routes/legalNaturalPerson";
import createBankRelationship from "./routes/createBankRelationship";

const app = express();

// Middleware for parsing JSON and URL-encoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up template engine
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'templates'));

// Serve static assets - make the assets directory directly accessible
app.use('/data', express.static(path.join(__dirname, "assets/data")));
app.use('/assets', express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "public")));

// Register routes
app.use("/", homeRoutes);
app.use("/getAccount", getAccount);
app.use("/createAccount", createAccountRoutes);
app.use("/legalNaturalPerson", legalNaturalPersonRoutes);
app.use("/bankRelationship", createBankRelationship);

export default app;