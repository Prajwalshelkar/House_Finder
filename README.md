# 🏡 NagpurHomes — Real Estate Discovery & Dealer Management Portal

**NagpurHomes** is a full-stack real estate discovery and dealer management portal built specifically for Nagpur's residential and commercial micro-markets (Dharampeth, Wardha Road, Besa, Manish Nagar, Sitabuldi, MIHAN, Sadar, and Ramdaspeth).

---

## 🌟 Key Features

1. **Property Discovery & Multi-Filtering Engine**:
   - Buy vs Rent toggle
   - BHK selection (1 BHK to 4+ BHK / Penthouses)
   - Budget range selector (₹15 Lakhs to ₹3.5+ Crores)
   - Locality filter for 12+ Nagpur neighborhoods
   - Sort by Featured, Price (Low/High), and Built-up Area
   - Grid and List layouts with live result counts

2. **Interactive City Map (`/map`)**:
   - Powered by Leaflet & OpenStreetMap (zero API key or watermarks)
   - Centered on Nagpur (`21.1458° N, 79.0882° E`)
   - Custom dynamic price pins (`₹58L`, `₹2.15Cr`, `₹44L`, `₹24k/mo`)
   - Interactive popups and synchronization with property cards
   - Quick-jump locality pills to fly between Dharampeth, Besa, MIHAN, etc.

3. **Property Details & Mortgage Tools (`/property/[id]`)**:
   - High-res photo gallery viewer
   - Key specifications (Carpet area, Facing, Possession, Verified Amenities)
   - Exact neighborhood mini-map
   - **Interactive EMI Calculator**: Real-time monthly outflow calculation, interest rate slider (8.5%), tenure slider (up to 30 years), and visual Principal vs Interest breakdown
   - **Lead Capture Modal**: Direct inquiry form that saves leads to SQLite and opens WhatsApp directly with the assigned dealer

4. **Dealer Portal & Management Hub (`/dealer-dashboard`)**:
   - Multi-dealer simulation switcher (Rajesh Agrawal, Sunita Deshmukh, Amit Sharma, Vikram Patil)
   - Real-time CRM: View buyer leads, update statuses (`NEW` -> `CONTACTED` -> `VISIT_SCHEDULED` -> `CLOSED`)
   - Direct WhatsApp & Phone call actions to buyers
   - **Inventory & Demo Manager**: Post new properties via modal and delete demo listings with 1-click confirmation

5. **Buyer Shortlist & Side-by-Side Comparison**:
   - Save / favorite properties with heart icons
   - Floating comparison drawer at the bottom of the screen
   - Side-by-side comparison matrix comparing Price, Rate/sq.ft, BHK, Area, RERA ID, and Estimated EMI

6. **Gemini AI Features**:
   - **AI Price Valuation Estimator (`/ai-valuation`)**: Instant fair market appraisal, price/sq.ft benchmark, rental yield, and 3-year capital appreciation projection
   - **Nagpur Neighborhood Matcher (`/neighborhood-matcher`)**: Matches your daily commute, family profile, and budget to the top 3 Nagpur localities

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router, Turbopack), TypeScript, Tailwind CSS, Lucide Icons
- **Interactive Maps**: Leaflet.js, OpenStreetMap tiles
- **Database & ORM**: SQLite, Prisma ORM
- **AI Engine**: Google Gemini API (`@google/genai`) with localized Nagpur heuristic estimation fallback

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database & Seed Nagpur Data
```bash
npx prisma db push
npx prisma db seed
```

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Key Routes

| Route | Description |
|---|---|
| `/` | Landing page with Hero search & locality highlights |
| `/properties` | Search & filter properties in Nagpur |
| `/property/[id]` | Dynamic property details, EMI calculator & lead modal |
| `/map` | Fullscreen interactive OpenStreetMap view |
| `/dealers` | MahaRERA verified dealer directory |
| `/dealer-dashboard` | Dealer CRM & inventory management hub |
| `/ai-valuation` | AI-powered property price valuation tool |
| `/neighborhood-matcher` | Lifestyle locality matcher |
