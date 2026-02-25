# Hero Vida AI Assessment Prototype

**AI-Powered Vehicle & Two-Wheeler Damage Assessment**
*(Built for Hero Vida Campus Challenge #10)*

This prototype is a web application that helps automatically analyze vehicle damage from photos. Built specifically to address **Case Study #2: Vehicle Damage Detection & Intelligent Assessment**, it allows users (dealers, customers, field agents) to upload an image of a damaged vehicle (Motorcycles, Scooters, 3W, 4W) and receive an immediate AI-driven assessment.

---

## 🚀 Hackathon Problem Statement Addressed

Vehicle inspections during insurance claims, dealer intake, and service check-ins are often manual, time-consuming, subjective, and error-prone. 

This prototype solves this by providing:
* **Instant Damage Detection & Localization:** Bounding boxes identifying exactly where the damage is.
* **Damage Classification:** Identifies Scratches, Dents, Cracks, Broken Parts, etc.
* **Functional vs Cosmetic:** Differentiates between superficial paint damage and structural/functional breaks.
* **Severity Estimation:** Classifies damage as Low, Medium, High, or Critical.
* **Cost Estimation (INR):** Provides a granular repair breakdown (Labor vs Parts) with options for Genuine, Aftermarket, or Used parts, localized to the Indian market.
* **Fraud Risk Assessment:** Flags potential anomalies (e.g. rust on a supposedly new accident).
* **Explainability:** Renders visual overlays and provides text summaries of the AI's reasoning.

---

## 🛠 Tech Stack

* **Frontend:** React 19, Vite, Tailwind CSS (Customized Hero Vida Purple Theme)
* **AI Engine:** Advanced Multimodal Vision API
* **Backend/Auth:** Firebase (for persistent report history and user sessions)
* **UI Components:** Lucide React, Recharts

---

## ⚙️ Setup & Installation

### Prerequisites
* Node.js (v18+ recommended)
* A valid API Key for the Vision AI

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the root directory:
   ```env
   VITE_API_KEY=your_api_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` (or the port specified by Vite).

---

## 📱 How to Use the Prototype

1. **Login:** Use the Mock Login to bypass authentication for demo purposes.
2. **Launch Scanner:** Click "Start Assessment" on the dashboard.
3. **Upload Image:** Upload a clear photo of vehicle damage (2W, 3W, or 4W).
4. **View Report:** The system will process the image via the AI engine and return a comprehensive report including visual bounding boxes, severity, category (Functional/Cosmetic), fraud risk, and itemized cost estimates in INR.
5. **PDF Export:** Click "Download PDF Report" to generate an exportable document.

