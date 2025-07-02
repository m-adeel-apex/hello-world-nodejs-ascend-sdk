# Ascend Fintech App

A comprehensive fintech application built with Node.js, Express, and TypeScript that integrates with the Apex Ascend SDK to provide a complete account management and trading platform.

## 🎯 Purpose

This application serves as a demonstration and testing platform for the Apex Ascend Workstation API - Typescript SDK, providing a user-friendly interface for:

- **Account Creation & Management**: Create and manage financial accounts
- **Identity Verification**: Legal natural person creation and verification
- **Bank Relationship Management**: Link bank accounts and verify micro-deposits
- **Account Enrollment**: Enroll accounts for trading capabilities
- **Trade Booking**: Execute trades with full functionality
- **Mobile-First Design**: iPhone-style mobile interface for all features

## 🏗️ Architecture

- **Backend**: Node.js with Express.js and TypeScript
- **Frontend**: HTML, CSS, Bootstrap for responsive UI
- **Mobile UI**: Custom iPhone-style CSS for mobile banking experience
- **API Integration**: Apex Ascend SDK for fintech operations
- **Data Storage**: JSON files for payload templates and localStorage for session data

## 🔄 Application Flow

### 1. Complete Account Setup Flow
```
Legal Natural Person Creation → Account Creation → Account Enrollment → Bank Relationship → Micro-Deposit Verification → Trade Booking
```

### 2. Enhanced Integration Flow
```
Legal Natural Person Creation → (Auto-redirect with credentials) → Account Creation → Account Enrollment → Bank Relationship → Micro-Deposit Verification → Trade Booking
```

### 3. Mobile-First Experience
```
All features available in both desktop and mobile versions with iPhone-style UI
```

## 📋 Available Features

### 1. Legal Natural Person Management
- **Routes**: `/legalNaturalPerson` (Desktop) | `/legalNaturalPersonMobile` (Mobile)
- **Purpose**: Create legal entities for account ownership
- **Features**: 
  - **Mobile-responsive iPhone-style UI with custom CSS**
  - **Clean, modern interface with debug panel**
  - Form validation and error handling
  - **Automatic redirection to account creation with credentials**
  - **Seamless integration with account creation process**
  - **Pre-filled form data from localStorage**
  - **Dynamic response display with show/hide functionality**

### 2. Account Creation
- **Routes**: `/createAccount` (Desktop) | `/createAccountMobile` (Mobile)
- **Purpose**: Create financial accounts for trading
- **Features**:
  - **Automatic integration with Legal Natural Person credentials**
  - **Displays Legal Natural Person information**
  - **Mobile-responsive design with iPhone-style UI**
  - Dynamic payload generation with Legal Natural Person ID
  - Account ID extraction and storage
  - Integration with legal natural person data
  - **Pre-filled account IDs from localStorage**
  - **Enhanced error handling and validation**

### 3. Account Management
- **Route**: `/getAccount`
- **Purpose**: Retrieve and display account details
- **Features**:
  - Account lookup by ID
  - Detailed account information display
  - Error handling for invalid accounts
  - **Mobile-responsive design**

### 4. Account Enrollment
- **Route**: `/getEnroll`
- **Purpose**: Enroll accounts for trading capabilities
- **Features**:
  - Agreement listing and affirmation
  - Account enrollment process
  - Status tracking
  - **Mobile-responsive design**

### 5. Bank Relationship Management
- **Routes**: `/createBankRelationship` (Desktop) | `/createBankRelationshipMobile` (Mobile)
- **Purpose**: Link bank accounts to trading accounts
- **Features**:
  - **Dynamic routing and account number generation**
  - **Mobile-responsive iPhone-style UI**
  - **Pre-filled account IDs from localStorage**
  - **Enhanced form validation**
  - Micro-deposit verification setup
  - Bank account validation
  - **Dynamic response display**
  - **Created name display after successful API calls**

### 6. Micro-Deposit Verification
- **Route**: `/verifyMicroDeposits`
- **Purpose**: Verify bank account ownership through micro-deposits
- **Features**:
  - Amount verification
  - Bank relationship validation
  - Success/failure handling
  - **Mobile-responsive design**

### 7. Trade Booking (Fully Functional)
- **Route**: `/tradeBooking`
- **Purpose**: Execute trades with complete functionality
- **Features**:
  - **Working trade creation with proper API integration**
  - **Fixed payload structure and parameter handling**
  - **Account ID integration from localStorage**
  - **Enhanced error handling and validation**
  - **Mobile-responsive design**
  - **Dynamic payload generation**
  - **Real-time trade execution**

### 8. Additional Features
- **Route**: `/affirmAccount` - Account affirmation functionality
- **Route**: `/affirmSingle` - Single affirmation process
- **Route**: `/contact` - Contact information
- **Route**: `/about` - About page
- **Route**: `/home` - Home dashboard

## 🔌 API Endpoints

### Backend Routes

| Route | Method | Purpose | Status | Mobile Version |
|-------|--------|---------|--------|----------------|
| `/legalNaturalPerson` | GET/POST | Create legal entities | ✅ Working | ✅ `/legalNaturalPersonMobile` |
| `/createAccount` | GET/POST | Create accounts | ✅ Working | ✅ `/createAccountMobile` |
| `/getAccount` | GET | Retrieve account details | ✅ Working | - |
| `/getEnroll` | GET/POST | Enroll accounts | ✅ Working | - |
| `/createBankRelationship` | GET/POST | Link bank accounts | ✅ Working | ✅ `/createBankRelationshipMobile` |
| `/verifyMicroDeposits` | GET/POST | Verify micro-deposits | ✅ Working | - |
| `/tradeBooking` | GET/POST | Execute trades | ✅ Working | - |
| `/affirmAccount` | GET/POST | Account affirmation | ✅ Working | - |
| `/affirmSingle` | GET/POST | Single affirmation | ✅ Working | - |

### Frontend Features

- **Responsive Design**: Mobile-first approach with Bootstrap
- **iPhone-Style UI**: Custom CSS for mobile banking experience
- **Form Validation**: Client-side and server-side validation
- **Error Handling**: Comprehensive error messages and logging
- **Data Persistence**: localStorage for session management
- **Dynamic UI**: Show/hide response areas and debug panels
- **Pre-filled Forms**: Automatic data population from localStorage
- **Enhanced UX**: Smooth transitions and modern interface

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Apex Ascend API credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ascend-fintech-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file with your API credentials
   APEX_API_KEY=your_api_key_here
   APEX_PRIVATE_KEY=your_private_key_here
   APEX_SERVICE_ACCOUNT_NAME=your_service_account_name
   APEX_ORGANIZATION=your_organization
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
ascend-fintech-app/
├── src/
│   ├── routes/           # Express route handlers
│   │   ├── *.ts         # Desktop routes
│   │   └── *Mobile.ts   # Mobile-specific routes
│   ├── templates/        # HTML templates
│   │   ├── *.html       # Desktop templates
│   │   └── *Mobile.html # Mobile templates
│   ├── assets/
│   │   ├── data/        # JSON payload templates
│   │   └── styles/      # CSS stylesheets
│   │       ├── main.css
│   │       ├── mobileApp.css
│   │       ├── iphone.css
│   │       └── loader.css
│   ├── utils/           # Utility functions
│   │   └── ascend.ts    # Apex Ascend SDK integration
│   ├── redux/           # State management
│   └── types/           # TypeScript type definitions
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Configuration

### API Credentials
The application uses the Apex Ascend SDK with the following configuration:
- **API Key**: For authentication
- **Service Account**: For elevated permissions
- **Organization**: Target organization for operations

### Payload Templates
JSON files in `src/assets/data/` contain template payloads for API calls:
- `createLegalNaturalPerson.json`
- `createAccount.json`
- `createBankRelationship.json`
- `tradeBooking.json`
- `createOrder.json`
- `enrollAccount.json`
- `verifyMicroDeposits.json`

### CSS Styling
- **main.css**: Base styles and Bootstrap overrides
- **mobileApp.css**: Mobile-specific responsive design
- **iphone.css**: iPhone-style UI components
- **loader.css**: Loading animations and transitions

## 🎨 UI/UX Features

### Mobile Experience
- **iPhone-style interface** with rounded corners and modern design
- **Touch-friendly buttons** and form elements
- **Responsive layouts** that adapt to different screen sizes
- **Smooth animations** and transitions
- **Debug panels** for development and testing

### Desktop Experience
- **Clean, professional interface** with Bootstrap styling
- **Comprehensive form validation** with real-time feedback
- **Detailed error messages** and success notifications
- **Data persistence** across sessions

### Common Features
- **Dynamic response areas** that show/hide based on API responses
- **Pre-filled forms** using localStorage data
- **Enhanced error handling** with detailed logging
- **Loading states** and progress indicators

## 🔮 Recent Improvements

### ✅ Completed Features
- **Mobile versions** for all major features
- **iPhone-style UI** with custom CSS
- **Working trade booking** with proper API integration
- **Enhanced form validation** and error handling
- **Dynamic UI elements** with show/hide functionality
- **Pre-filled forms** from localStorage
- **Debug panels** for development
- **Responsive design** for all screen sizes

### 🚀 Performance Optimizations
- **Optimized API calls** with proper error handling
- **Enhanced data flow** between components
- **Improved user experience** with better feedback
- **Streamlined navigation** between features

## 🐛 Known Issues

1. **API Method Availability**: Some SDK methods may require specific permissions
2. **Environment Setup**: Certain features may require specific API environment configuration

## 🔮 Future Enhancements

- [ ] Add real-time account balance updates
- [ ] Implement transaction history
- [ ] Add portfolio management features
- [ ] Enhance mobile UI/UX further
- [ ] Add user authentication and session management
- [ ] Implement real-time notifications
- [ ] Add advanced trading features

## 📝 API Documentation

For detailed API documentation, refer to the [Apex Ascend SDK documentation](https://docs.apexfintechsolutions.com/).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the API documentation
- Review the error logs in the console
- Contact the development team

---

**Note**: This application is for demonstration and testing purposes. Ensure proper security measures when deploying to production environments.