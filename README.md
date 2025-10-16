Mini Admin Panel
Live Demo: https://admin-panel-dk9j.onrender.com/
Login Credentials:

Username: admin

Password: admin123

A full-stack admin panel with React frontend and Node.js backend featuring user management, analytics, Protobuf serialization, and cryptographic security.

Quick Start
Local Development
Backend:

bash
cd backend
npm install
npm start
# Runs on http://localhost:5000
Frontend:

bash
cd frontend  
npm install
npm start
# Runs on http://localhost:3000
📋 Features
✅ Core Functionality
User Management - Create, read, update, delete users

User Analytics - Chart showing registrations over last 7 days

Protobuf Export - Export users in Protocol Buffer format

Cryptographic Security - SHA-384 hashing & RSA digital signatures

Simple Login System - Basic authentication to protect admin access

🛠 Tech Stack
Frontend: React, Recharts, Axios

Backend: Node.js, Express, SQLite

Security: RSA cryptography, SHA-384 hashing

Data: Protocol Buffers for efficient serialization

🔧 Usage
Login using the credentials above

Manage Users in the User Management tab

View Analytics in the User Graph tab

Export Data using Protobuf in the Export tab

All user data includes cryptographic signatures that are automatically verified before display.

📝 Notes
SQLite database used for simplicity

Auto-generated RSA keys on first run

Frontend-only authentication (for demo purposes)

Responsive design for mobile devices

🚀 Deployment
Deployed on Render with separate frontend and backend services. The application demonstrates full-stack development with modern web technologies and security practices.

Demo Credentials: admin / admin123
Live Site: https://admin-panel-dk9j.onrender.com/