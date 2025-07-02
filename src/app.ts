import express from "express";
import path from "path";
import homeRoutes from "./routes/home";
import getAccount from "./routes/getAccount";
import createAccountRoutes from "./routes/createAccount";
import createAccountMobile from "./routes/createAccountMobile";
import legalNaturalPersonRoutes from "./routes/legalNaturalPerson";
import legalNaturalPersonMobile from "./routes/legalNaturalPersonMobile";
import createBankRelationship from "./routes/createBankRelationship";
import createBankRelationshipMobile from "./routes/createBankRelationshipMobile";
import verifyMicroDeposits from "./routes/verifyMicroDeposits";
import getMicroDepositAmounts from "./routes/getMicroDepositAmounts";
import getEnroll from "./routes/getEnroll";
import affirmAccount from "./routes/affirmAccount";
import iosBankRelationship from "./routes/iosBankRelationship";
import BankRelationshipPageSDK from "./routes/BankRelationshipPageSDK";
import enrollAccount from "./routes/enrollAccount";
import affirmSingle from "./routes/affirmSingle";
import tradeBooking from "./routes/tradeBooking";
import createOrder from "./routes/createOrder";

const app = express();

// Middleware for parsing JSON and URL-encoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up template engine
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'templates'));

// Register routes BEFORE static file middleware
app.use("/", homeRoutes);
app.use("/getAccount", getAccount);
app.use("/createAccount", createAccountRoutes);
app.use("/createAccountMobile", createAccountMobile);
app.use("/legalNaturalPerson", legalNaturalPersonRoutes);
app.use("/legalNaturalPersonMobile", legalNaturalPersonMobile);
app.use("/createBankRelationship", createBankRelationship);
app.use("/createBankRelationshipMobile", createBankRelationshipMobile);
app.use("/verifyMicroDeposits", verifyMicroDeposits);
app.use("/getMicroDepositAmounts", getMicroDepositAmounts);
app.use("/getEnroll", getEnroll);
app.use("/affirmAccount", affirmAccount);
app.use("/ios-bank", iosBankRelationship);
app.use("/bank-sdk", BankRelationshipPageSDK);
app.use("/enrollAccount", enrollAccount);
app.use("/affirmSingle", affirmSingle);
app.use("/tradeBooking", tradeBooking);
app.use("/createOrder", createOrder);

// Serve static assets - make the assets directory directly accessible
app.use('/data', express.static(path.join(__dirname, "assets/data")));
app.use('/assets', express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "public")));

export default app;