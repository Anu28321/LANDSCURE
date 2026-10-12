# LANDSure
## AI-Powered Land Discovery & Document Verification System

### Project Overview
LANDSure is a project designed to help users discover land
and manage land document verification information.

### Main Features
- Land discovery by location and budget
- Landowner document uploads
- AI-assisted document detail checking
- Verification status and mismatch tracking
- Buyer purchase requests
- Admin review support

### Database
Database: MySQL
Database Name: landsure

### Database Tables
1. users - Stores buyer, owner, and admin information.
2. lands - Stores land listing details.
3. documents - Stores uploaded document information.
4. verification_results - Stores document matching results.
5. purchase_requests - Stores buyer requests for land.

### Relationships
- One user can own multiple lands.
- One land can have multiple documents.
- One document can have multiple verification results.
- Buyers and owners are linked to purchase requests.
- Each purchase request is linked to a land listing.

### Tools Used
- MySQL
- MySQL Workbench
- Visual Studio Code
- GitHub

### Important Note
AI-assisted checks do not replace official land-record
verification or legal review.