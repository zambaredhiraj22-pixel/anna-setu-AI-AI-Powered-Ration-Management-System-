# AnnaSetu AI – AI-Powered Ration Management System

An intelligent ration management platform designed to digitize ration distribution, manage beneficiary records, track stock availability, and forecast future ration demand using Artificial Intelligence.

## 🚀 Project Overview

**AnnaSetu AI** aims to improve transparency, efficiency, and stock management in the public distribution system. It provides role-based access for administrators, officers, and users, along with an AI-powered demand forecasting feature to support better ration planning.

## ✨ Key Features

- **User Authentication:** Secure registration and login using JWT authentication.
- **Role-Based Access Control:** Separate permissions for ADMIN, OFFICER, and USER roles.
- **Beneficiary Management:** Register and manage ration beneficiaries.
- **Commodity Management:** Maintain information about ration commodities.
- **Stock Management:** Add, update, and monitor available stock quantities.
- **Ration Distribution:** Record ration distribution to beneficiaries.
- **AI Demand Forecasting:** Predict estimated ration demand using a Machine Learning model.
- **Dashboard:** Access relevant information and management features based on user roles.
- **REST APIs:** Connect the React frontend with the Spring Boot backend and Python AI service.

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| Frontend | React.js, Vite, JavaScript |
| Backend | Java, Spring Boot |
| Security | Spring Security, JWT |
| Database | MySQL |
| AI Service | Python, FastAPI, Scikit-learn |
| Machine Learning | Linear Regression |
| API Communication | REST APIs |
| Version Control | Git, GitHub |

## 🏗️ System Architecture

```text
React + Vite Frontend
         |
         | REST API + JWT
         v
Spring Boot Backend
         |
         +------ MySQL Database
         |
         +------ Python FastAPI AI Service
                         |
                         v
                 ML Demand Forecast
```

## 👥 User Roles

### ADMIN
- Manage beneficiaries.
- Add, update, and delete commodities.
- Manage stock and ration distribution.
- Access AI demand forecasting.

### OFFICER
- View beneficiary records.
- Manage stock and ration distribution.
- View commodities and AI forecasts.

### USER
- Register and access the application.
- View permitted commodity and stock information.
- Access the AI forecast feature
