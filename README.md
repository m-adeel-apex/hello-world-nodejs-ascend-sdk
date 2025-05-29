This project is designed to create and manage SDKs using Apexascend SDK integration. It includes routes, utilities, and templates to test and create relationships with bank accounts using a sample payload. The project reads from a centralized JSON file (createBankRelationship.json) and dynamically updates values as needed.

Features
API integration for bank relationships
Dynamic payload updates (e.g., routing number and account number)
LocalStorage-based account ID management
Separation of client-side (HTML/JavaScript) and server-side (TypeScript/Node.js) logic
Error handling and debugging utilities
Installation
Prerequisites
Before setting up the project, make sure the following tools are installed:

Node.js (v14 or later)
npm (Node Package Manager)
Git
Step-by-Step Setup
Clone Repository
git clone <repository-url>
cd <project-folder>
Replace <repository-url> with your GitHub repository link.

Install Dependencies
Run the following command to install all the required dependencies:

npm install
Folder Structure
The key structure of the project is:

src/
├── routes/                # Contains API routes
├── utils/                 # Utility functions and helpers
├── assets/
│   ├── data/              # Centralized JSON files
│   │   └── createBankRelationship.json
│   ├── styles/            # CSS and frontend styling
├── views/                 # Frontend HTML templates
Update/Create JSON File
Ensure the createBankRelationship.json file exists in the assets/data folder. This file will hold the payload structure for creating Bank Relationships.

Example format for the JSON file:

{
  "bankAccount": {
    "routingNumber": "",
    "accountNumber": "",
    "owner": "Apex Relationship Account",
    "type": "SAVINGS"
  },
  "nickname": "Trading account",
  "verificationMethod": "MICRO_DEPOSIT"
}
Environment Setup
If the project requires environment variables (e.g., API keys), create a .env file in the root directory:

touch .env
Add the necessary variables:

PORT=3000
API_KEY=<API_KEY>
Running the Project
Start the Development Server
To run the project locally:

npm run start
By default, the app will run on http://localhost:3000.

Endpoints
Home Route
Method: GET
Path: /
Description: Renders the HTML interface to create bank relationships.
Payload Route
Method: GET
Path: /payload
Description: Serves the createBankRelationship.json payload.
Create Bank Relationship
Method: POST
Path: /
Description: Creates a bank relationship using the payload and dynamically injects account information.
How to Test
Testing via Browser
Navigate to the home page (http://localhost:3000).
Enter the account ID or utilize the saved account ID from localStorage.
Click "Create Bank Relationship" to send the request and display responses dynamically.
Testing via API Client (Postman, Insomnia, etc.)
Use the POST endpoint (http://localhost:3000/) to test payload creation.
Ensure proper payload structure is passed in the request body.
Development Notes
Customize Routing Number & Account Number Generation
The server-side dynamically generates routing numbers and account numbers based on business logic. These configurations can be adjusted in the generateRandomNumberString() function found in src/routes/index.ts.

Error Handling
The project includes clear error-handling mechanisms for missing payloads or invalid structures.

Contributing
We welcome contributions to enhance application functionality! Please follow these steps:

Fork the repository.
Create a new branch: git checkout -b feature-name.
Make your changes and commit: git commit -m "Add new feature".
Push to the branch: git push origin feature-name.
Submit a Pull Request for review!

License
This project is licensed under the MIT License. See the LICENSE file for details.

Support
For any questions or support, please feel free to reach out via GitHub Issues.
