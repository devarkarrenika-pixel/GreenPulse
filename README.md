# 🌿 GreenPulse

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-4CAF50?style=for-the-badge)](https://opensource.org/licenses/MIT)

**GreenPulse** is a premium, interactive web application designed to help individuals calculate, track, and offset their personal carbon footprint. Combining game design mechanics with real-world botanical data and artificial intelligence, GreenPulse turns climate action into an engaging daily routine.

---

## ✨ Features

- **📊 Dynamic Carbon Estimator**: An interactive multi-category calculator evaluating transportation, dietary habits, home energy bills, and consumption rates.
- **⚡ Gamified Dashboard**: Track your daily eco-habits with a checklist, build streaks, level up (from *Carbon Onboarder* to *Carbon Neutral Hero*), and watch your XP grow.
- **🌱 Carbon-Saving Challenges**: Commit to and complete sustainability challenges (e.g., *Car-Free Commute*, *Plant-Based Weekdays*) that dynamically reduce your computed carbon score.
- **🎫 Green Rewards Shop**: Redeem points earned from daily streaks and challenges for coupons/discounts from sustainable brand partners.
- **🌲 Botanical Forest Simulator**: Visualize the exact number of trees needed to offset your carbon footprint, simulate costs, and earn a downloadable *Certificate of Carbon Neutrality*.
- **🤖 PulseAI Advisor**: A built-in chatbot offering instant, expert advice on home energy saving, composting, diet swaps, and green transport options.

---

## 🗺️ Application Architecture

The following flowcharts detail how GreenPulse handles the user journey and processes carbon calculations:

### 1. User Journey & Core Flow

```mermaid
graph TD
    A([Start: Land on GreenPulse]) --> B{Has Estimated Footprint?}
    B -- No / Reset --> C[Onboarding Welcome Screen]
    C --> D[Run Carbon Footprint Estimator]
    D --> E[Submit Answers]
    B -- Yes --> F[Main Dashboard]
    E --> F
    
    F --> G[Daily Habits Checklist]
    F --> H[Explore Green Challenges]
    F --> I[Redeem Reward Coupons]
    F --> J[Offset Forest Simulator]
    F --> K[Ask PulseAI Eco-Advisor]
    
    G -- Complete Daily Actions --> L[Earn +15 Pts & Advance Streak]
    H -- Commit & Complete Challenge --> M[Earn points + Offset Footprint dynamically]
    I -- Spend Accumulated Points --> N[Unlock Partner Shopping Coupons]
    J -- Reach 100% Offset Slider --> O[Receive Certificate of Carbon Neutrality]
    
    L & M --> P[Increase Level & XP Progress]
    P --> F
```

### 2. Carbon Footprint & Points Calculation Model

```mermaid
graph TD
    subgraph INPUTS [User Inputs]
        I1[Vehicle Type & Miles]
        I2[Diet Type]
        I3[Electric Bill & Clean Energy %]
        I4[Shopping Habits & Recycling %]
    end

    subgraph CALC [Calculation Engine]
        C1["Transport Footprint = (Miles * 52 * 0.000404 * VehicleMult) + (Transit * 52 * 0.00014) + (Flights * 0.8)"]
        C2["Diet Footprint = Base Diet Tons (1.2 to 3.3)"]
        C3["Energy Footprint = (Bill / 0.15 * 12 * 0.00038 * (1 - Clean %)) + Heating constant"]
        C4["Consumption Footprint = Base Shopping Tons - Recycling Saving"]
    end

    subgraph OFFSET [Offset Credits]
        O1[Completed Challenges]
        O2[Forest Simulator Offset]
    end

    I1 --> C1
    I2 --> C2
    I3 --> C3
    I4 --> C4

    C1 & C2 & C3 & C4 --> CF_TOTAL[Gross Footprint]
    CF_TOTAL --> NET_CALC{Subtract Completed Challenges}
    O1 --> NET_CALC
    NET_CALC --> NET_FOOTPRINT[Net Annual Carbon Footprint]
    
    NET_FOOTPRINT --> FOREST_SIM["Forest Simulator: Scale Trees (1 Tree = 22kg/year)"]
    O2 --> FOREST_SIM
    FOREST_SIM --> NEUTRAL[Carbon Neutrality Seal]
```

---

## 🧮 Botanical & Environmental Constants

GreenPulse calculates your carbon impact using standardized environmental parameters:

| Variable | Source Metrics | CO₂ / Unit Equivalents |
| :--- | :--- | :--- |
| **Gasoline Car** | EPA Emissions Factor | `0.404 kg CO₂` per mile |
| **Hybrid Car** | Eco-efficiency factor | `0.202 kg CO₂` per mile (50% reduction) |
| **Electric Car** | Grid charging average | `0.061 kg CO₂` per mile (85% reduction) |
| **Public Transit** | Passenger average | `0.140 kg CO₂` per passenger-mile |
| **Flight** | Average round-trip flight | `0.800 metric tons CO₂` per flight |
| **Diet (High Meat)** | Average annual dietary CO₂ | `3.300 metric tons CO₂` per year |
| **Diet (Vegan)** | Plant-based dietary CO₂ | `1.200 metric tons CO₂` per year |
| **Electricity** | Average electrical grid CO₂ | `0.380 kg CO₂` per kWh |
| **Forest Offset** | Standard tree absorption capacity | `22.000 kg CO₂` absorbed per tree / year |

---

## 🛠️ Tech Stack

- **Frontend Core**: React 19, TypeScript 6.0, Vite 8.0
- **Iconography**: Lucide React
- **Design System**: Vanilla CSS Glassmorphism (Vibrant overlays, blurred container backdrops, dark-mode friendly HSL-customizable palettes)
- **Deployment**: Docker containerization, Google Cloud Run integration, Firebase Hosting options

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) and [npm](https://www.npmjs.com/) installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/devarkarrenika-pixel/GreenPulse.git
   cd GreenPulse
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

4. Build the application for production:
   ```bash
   npm run build
   ```

---

## 📦 Deployment Configuration

### Docker Execution
To run GreenPulse inside a container locally:
```bash
docker build -t greenpulse-app .
docker run -p 8080:8080 greenpulse-app
```

### CI/CD Deployment
This repository is configured with a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys your changes to **Google Cloud Run** on every push to the `main` branch. 

To enable this:
1. Set up a GCP Service Account with permissions for Artifact Registry and Cloud Run.
2. Add your GCP Service Account credentials JSON key as a secret named `GCP_SA_KEY` in your GitHub repository secrets.
3. Update the `PROJECT_ID` inside `.github/workflows/deploy.yml` with your actual GCP Project ID.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
