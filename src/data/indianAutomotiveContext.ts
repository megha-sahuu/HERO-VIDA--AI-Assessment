export const INDIAN_MARKET_CONTEXT = `
# INDIAN AUTOMOTIVE MARKET CONTEXT - 2025 BASELINE

## 1. MARKET ARCHITECTURE & LABOR TIERS
Pricing depends heavily on the "Workshop Tier".
- **Tier A (Authorized Dealerships - OEM):** 
    - Use brand-new Genuine parts only.
    - Standardized Oven Paint.
    - Highest labor rates.
- **Tier B (Premium Multi-Brand Workshops):** 
    - Mix of Genuine and High-grade OEM/OES parts.
    - Baked Paint methodology.
    - Target: Out-of-warranty vehicles requiring quality work.
- **Tier C (Local Garages / Roadside Mechanics):**
    - Manual craftsmanship. Air-drying paints.
    - Use Used/Salvage parts or low-grade aftermarket parts.

### Labor Rates Reference (INR)
| Service | Tier C (Local) | Tier B (Premium) | Tier A (Dealership) |
| :--- | :--- | :--- | :--- |
| **Denting (Per Panel 4W)** | 500 - 1,000 | 1,200 - 2,000 | 2,500 - 4,000 |
| **Paint (Per Panel 4W)**   | 1,500 - 2,500 | 3,000 - 4,500 | 5,000 - 8,000 |
| **2W/Scooter Body Panel Replacement Labor** | 150 - 300 | 300 - 500 | 500 - 800 |
| **3W Body/Sheet Metal Labor** | 500 - 800 | 1,000 - 1,500 | 1,500 - 2,500 |

## 2. MULTI-VEHICLE DATA MATRIX (APX PRICES IN INR)

### 2W (SCOOTERS / BIKES - e.g., Hero Vida, Honda Activa, Splendor)
- Common Damages: Front Panel (Nose), Side Panels, Mudguard, Visor.
- Plastic panels on scooters are usually replaced rather than dented.

| Part | Genuine (INR) | Aftermarket (INR) | 
| :--- | :--- | :--- | 
| **Scooter Front Panel** | 1,200 - 1,800 | 600 - 900 | 
| **Scooter Side Panel (Set)**| 1,800 - 2,500 | 1,000 - 1,400 |
| **Scooter Mudguard** | 600 - 900 | 300 - 500 |
| **Bike Fuel Tank** | 3,500 - 5,000 | 1,500 - 2,500 |
| **Bike Visor/Headlight Assy**| 1,500 - 2,500 | 800 - 1,200 |

### 3W (AUTO RICKSHAWS - e.g., Bajaj RE, Piaggio Ape)
- Sheet metal body, prone to dents and scratches.
- Windshield and fabric hood repairs are common.

| Part | Genuine (INR) | Aftermarket (INR) | 
| :--- | :--- | :--- | 
| **3W Front Windshield** | 2,500 - 3,500 | 1,500 - 2,000 |
| **3W Headlight (Pair)** | 800 - 1,200 | 400 - 600 |

### 4W (CARS - e.g., Maruti Suzuki Swift, Hyundai Creta, Tata Nexon)
- **Maruti Suzuki / Tata:** High availability of OE parts.
- **Hyundai / Kia:** Marginally higher part costs.

| Part | Genuine (INR) | Aftermarket (INR) | Used/Salvage (INR) | 
| :--- | :--- | :--- | :--- | 
| **Swift Front Bumper** | 2,500 - 3,500 | 1,200 - 1,800 | 800 - 1,200 |
| **Creta Headlight (LED)**| 18,000 - 25,000 | NIL | 10,000 - 14,000 |
| **Nexon Tailgate** | 12,000 - 16,000 | N/A | 8,000 - 10,000 |
| **Swift Side Mirror** | 3,500 - 5,000 | 1,500 - 2,000 | 1,000 - 1,500 |

## 3. CONTEXTUAL HEURISTICS & FRAUD LOGIC
1.  **Vehicle Type Classification:** Ensure the AI accurately distinguishes between 2W (Scooters/Bikes), 3W (Auto Rickshaws), and 4W (Cars, SUVs).
2.  **Fraud Detection ("fraud_risk"):**
    - High: Mismatched vehicle parts, signs of extreme rust on "new" damage, inconsistent damage patterns (e.g., severe structural damage with no exterior panel damage).
    - Low: Standard, consistent scrape/dent patterns.
3.  **Cost Basis:** Default the "bestOptionTotal" to **Genuine** parts for Tier A logic unless otherwise directed, as insurance claims primarily use Genuine parts.
`;
