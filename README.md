# Dérive: AI Skincare Concierge

A production-ready, full-stack microservice application that delivers personalized skincare routines. The system utilizes a privacy-first middleware architecture to securely orchestrate requests between a modern user interface and enterprise-grade artificial intelligence models hosted on the IBM Cloud platform.

---

## 🚀 Live Links

- **Frontend UI:** https://skincare-concierge.vercel.app/
- **Backend API:** https://skincare-concierge.onrender.com

---

# 🛠️ Tech Stack & Architecture

The application is engineered using a decoupled microservices architecture to ensure independent scalability, security, and high performance.

| Layer | Technology | Purpose |
|--------|------------|---------|
| **Frontend** | HTML5, CSS3 (Glassmorphism), JavaScript (ES6+) | Delivers a high-fidelity, responsive client interface running completely client-side. |
| **Backend** | FastAPI (Python 3.10+), Uvicorn, HTTPX | Acts as a secure, asynchronous gateway to manage cross-origin resource sharing (CORS) and external integrations. |
| **Development IDE** | IBM Bee | AI-assisted integrated development environment used for code generation, debugging, and accelerating the development workflow. |
| **AI Orchestration** | IBM Watsonx Orchestrate | Coordinates multi-model routing and handles complex runtime logic. |
| **Foundational Models** | IBM Granite 4h Small & GPT-OSS 120B | Leverages enterprise LLMs for highly structured, precise dermatological hygiene routine generation. |
| **Hosting (API)** | Render | Hosts the containerized Python environment with continuous deployment pipelines. |
| **Hosting (UI)** | Vercel / GitHub Pages | Serves static assets globally via a high-speed Content Delivery Network (CDN). |

---

# 📊 Core Evaluation Criteria Alignment

## 1. Enterprise Usage of IBM Cloud Platform

Unlike simple frontend wrappers that call generic endpoints directly from the browser, this project utilizes a secure backend middleware to interface with IBM Watsonx Orchestrate.

### Key Highlights

- IBM Granite 4h Small for targeted, optimized text extraction.
- GPT-OSS 120B for broad contextual reasoning.
- Secure server-to-server routing using dedicated instance URLs, protecting credential integrity.

---

## 2. Scalability & System Innovation

By separating the UI static assets from the computational backend logic, the system scales horizontally. The frontend payload is extremely lightweight, offloading the heavy processing tasks to the asynchronous FastAPI layer and IBM's robust cloud infrastructure.

---

## 3. Societal Contribution & Benefit

Dermatological health and personal skin hygiene have a direct impact on individual well-being. This tool lowers the barrier to personalized care by analyzing specific skin profiles and localized environmental data to give users structured, safe, and actionable daily skincare recommendations.

---

## 4. Readiness for Deployment

The project is completely out of the prototype phase. It features:

- ✅ Working frontend deployed via a CDN
- ✅ Live cloud-hosted API endpoint on Render
- ✅ Automated error-handling failovers
- ✅ Robust CORS protection
- ✅ Secure backend middleware
- ✅ Enterprise AI orchestration using IBM Watsonx

---

## 5. Commercial & Market Viability

This application can serve as a white-labeled business solution for:

- Digital health platforms
- E-commerce beauty applications
- Independent skincare brands

By integrating affiliate product link API mapping into the generated skincare routines, the platform already possesses an immediate and scalable monetization pathway.

---

## ✨ Architecture Overview

```text
User
   │
   ▼
Frontend (HTML/CSS/JavaScript)
   │
   ▼
FastAPI Backend (Python)
   │
   ▼
IBM Watsonx Orchestrate
   ├───────────────┐
   ▼               ▼
IBM Granite     GPT-OSS 120B
   │               │
   └──────┬────────┘
          ▼
 Personalized Skincare Routine
```

---

## 🔒 Security

- Backend-only API communication
- Hidden IBM Cloud credentials
- CORS protection
- Asynchronous request handling
- Secure middleware architecture
- Production-ready deployment

---

## 🌍 Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel / GitHub Pages |
| Backend | Render |
| AI Models | IBM Watsonx |
| Orchestration | IBM Watsonx Orchestrate |

---

## 📄 License

This project was developed for educational, innovation, and internship purposes using IBM Cloud technologies.
