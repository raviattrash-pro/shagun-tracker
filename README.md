# 💍 Shagun Tracker (शुभ विवाह बही-खाता)
### Traditional Indian Wedding Bahi-Khata, Live Gift Registry & Shagun Cash Manager

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1-729B1B?style=for-the-badge&logo=vitest)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **Shagun Tracker** transforms traditional Indian wedding cash gift (*शगुन*) tracking into an authentic, respectful digital **Bahi-Khata (पारंपरिक बही-खाता / लाल डायरी)** alongside a **Live Digital Wedding Gift Registry (लाइव शादी उपहार सूची)**. 
> 
> Designed to eliminate lost paper envelopes, mental math mistakes, awkward reciprocity confusion, and **duplicate wedding gifts**, Shagun Tracker gives families the simplicity and warmth of the red cloth ledger with real-time digital superpowers.

---

## 🌟 Core Pillars

1. **📖 Traditional Bahi-Khata (पारंपरिक लाल डायरी)**
   * Authentic ruled ledger styling (`|| श्री गणेशाय नमः ||`, `|| शुभ लाभ ||`, red spine cloth).
   * Tabbed sections for **Cash Shagun (नकद बही-खाता)**, **Live Wedding Registry (लाइव उपहार सूची)**, **Received Gifts (प्राप्त सामान)**, and **Reciprocity (लेन-देन डायरी)**.
   * Built-in 1-click ledger print and export.

2. **🎁 Live Wedding Gift List & Registry (लाइव शादी उपहार सूची)**
   * Curated gift wishlist (`Gift/Item`, `Suggested Store`, `Approx Cost`, `Who is bringing it?`, `Status`, `Notes`).
   * **Anti-Duplication**: Real-time `AVAILABLE (उपलब्ध)` vs `CLAIMED (बुक हो चुका)` tracking.
   * **1-Click Claim**: Guests can claim an item (*"मैं लाऊँगा/गी"*) so other relatives immediately know what is already taken and what is left.

3. **💌 Amplify Teak Wood Animated Envelope (काष्ठ लिफ़ाफ़ा)**
   * Hyper-realistic teak/walnut grain with debossed *AMPLIFY / SHAGUN* typography and lush canopy.
   * Luminous curved crest with white glove grab handle.
   * Radiant volumetric light leak and glowing amber energy seal (⚡).
   * Natural spring drag-down unsealing physics powered by Framer Motion.
   * Web Audio API synthesized cedar slide and crystal seal chime.

4. **🎙️ Bilingual Hindi & English Voice AI**
   * Spoken number parsing (*"ग्यारह हज़ार रुपये"*, *"इक्कीस सौ"*, *"पाँच हज़ार एक"*).
   * Automatic relation and name extraction (*"रमेश चाचाजी"*, *"सुनीता बुआ"*).

5. **💵 RBI Banknotes Breakdown & Auspicious +₹1 Coin**
   * Visual note stacks (₹500, ₹200, ₹100, ₹50, ₹20, ₹10).
   * Auspicious metallic coins (+₹1, +₹2, +₹5, +₹10).
   * Smart reciprocity calculation (+₹1 auspicious addition).

---

## 🏛️ High-Level Design (HLD)

### 1. System Architecture Overview

```mermaid
graph TD
    Client["Client Devices<br/>(Mobile PWA / Tablet / Desktop)"]
    
    subgraph Frontend["Frontend Layer (Next.js 14 App Router)"]
        BahiKhata["Traditional Bahi-Khata View<br/>(Crimson Red #8B1D2C / Parchment #FDFCF7)"]
        LiveRegistry["Live Wedding Gift Registry<br/>(Real-Time Claiming & Anti-Duplication)"]
        AmplifyEnvelope["Amplify Teak Wood Envelope<br/>(Framer Motion Drag Physics + Web Audio)"]
        VoiceEngine["Web Speech API<br/>(Hindi hi-IN / English en-IN)"]
        I18n["Bilingual i18n Context (Hindi / English)"]
    end
    
    subgraph APIRoutes["Next.js Serverless Edge & API Routes"]
        APIDashboard["/api/dashboard"]
        APIWeddingGifts["/api/wedding-gifts (Live Registry CRUD & Claims)"]
        APIGuests["/api/guests & /api/guests/:id"]
        APIEvents["/api/events & /api/events/:id"]
        APIGifts["/api/gifts & /api/gifts/:id"]
        APIReciprocity["/api/reciprocity"]
        AuthMiddleware["NextAuth Session Guard"]
    end
    
    subgraph CoreEngines["Core Business Logic Engines"]
        NLPParser["Bilingual Voice NLP Engine<br/>(Hindi numbers, relations, currency extract)"]
        RegistrySync["Live Registry Claim Engine<br/>(Locks items, prevents duplicates)"]
        DenominationCalc["Currency Denomination Engine<br/>(RBI greedy notes + Auspicious +₹1)"]
        MultiTenant["Multi-Tenant Isolation Layer<br/>(Demo mode vs Authenticated Family)"]
    end
    
    subgraph Database["Persistence Layer"]
        PrismaClient["Prisma ORM (v5.22)"]
        DB[(SQLite / PostgreSQL Storage)]
    end

    Client --> Frontend
    Frontend --> APIRoutes
    APIRoutes --> AuthMiddleware
    AuthMiddleware --> MultiTenant
    MultiTenant --> CoreEngines
    CoreEngines --> PrismaClient
    PrismaClient --> DB
```

### 2. Live Wedding Gift Claim Sequence (Anti-Duplication)

```mermaid
sequenceDiagram
    autonumber
    actor Guest as Relative / Guest
    participant UI as Traditional Bahi-Khata (Registry Tab)
    participant API as PATCH /api/wedding-gifts
    participant DB as SQLite / PostgreSQL (Prisma)
    actor OtherGuests as Other Relatives

    Guest->>UI: Views available gifts (e.g. Philips Air Fryer ₹7,499)
    Guest->>UI: Clicks "मैं लाऊँगा/गी" (Claim Gift)
    UI->>UI: Prompts for Guest Name & Phone
    Guest->>UI: Enters "Sunita Bua Ji" + Submits
    UI->>API: PATCH { id, action: "claim", claimedBy: "Sunita Bua Ji" }
    API->>DB: UPDATE WeddingGiftItem SET status='CLAIMED', claimedBy='Sunita Bua Ji'
    DB-->>API: Updated Record
    API-->>UI: 200 OK
    UI-->>OtherGuests: Item updates to "✓ बुक हो चुका (Sunita Bua Ji)"
    Note over OtherGuests: Other relatives see item is taken & pick another gift
```

---

## 🔬 Low-Level Design (LLD)

### 1. Database Schema & Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    User ||--o{ Event : "owns"
    User ||--o{ Guest : "manages"
    User ||--o{ WeddingGiftItem : "curates"
    Event ||--o{ Gift : "records"
    Guest ||--o{ Gift : "gives"
    Gift ||--o| Reciprocity : "triggers"
    Guest ||--o{ Reciprocity : "receives"

    WeddingGiftItem {
        String id PK
        String userId FK
        String title
        String category "Kitchen | Electronics | Gold | Decor"
        String suggestedStore "Amazon | Croma | Tanishq"
        String storeUrl
        Int approxCost
        String claimedBy "Relative Name"
        String claimedByPhone
        String status "AVAILABLE | CLAIMED"
        String notes
        DateTime createdAt
    }

    User {
        String id PK
        String email UK
        String name
        String passwordHash
        DateTime createdAt
    }

    Event {
        String id PK
        String userId FK
        String title
        String eventType "WEDDING | RECEPTION | SANGEET | HALDI"
        DateTime eventDate
        String venue
    }

    Guest {
        String id PK
        String userId FK
        String name
        String phone
        String city
        String relation "chacha | mama | bua | mausi | friend"
        String side "GROOM | BRIDE | MUTUAL"
        String photoUrl
    }

    Gift {
        String id PK
        String eventId FK
        String guestId FK
        String giftType "CASH | GIFT_ITEM | BOTH"
        Decimal cashAmount
        Json cashBreakdown "{ '500': 10, '100': 1 }"
        String giftDescription
        String envelopeStyle "AMPLIFY_WOOD | CLASSIC_RED"
        Boolean isOpened
        String voiceTranscript
        DateTime receivedAt
    }

    Reciprocity {
        String id PK
        String guestId FK
        String originalGiftId FK
        Decimal suggestedAmount
        Decimal actualAmount
        String status "PENDING | RETURNED | WAIVED"
        String returnEventName
    }
```

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/wedding-gifts` | Fetch all wedding wishlist items and registry summary stats | Public / Demo |
| `POST`| `/api/wedding-gifts` | Add a new desired gift to wedding registry wishlist | Session |
| `PATCH`| `/api/wedding-gifts` | Claim (`action: "claim"`) or unclaim (`action: "unclaim"`) a gift | Public / Guest |
| `DELETE`| `/api/wedding-gifts`| Remove an item from the registry wishlist | Session |
| `GET` | `/api/dashboard` | Dashboard metrics, recent gifts, and reciprocity status | Session |
| `GET` | `/api/guests` | Search and filter guest directory by relation, side, query | Session |
| `POST` | `/api/guests` | Create new relative profile | Session |
| `GET` | `/api/guests/:id` | Get relative profile, gift history, and total given | Session |
| `DELETE`| `/api/guests/:id` | Cascade delete relative and associated records | Session |
| `GET` | `/api/events` | List all wedding ceremonies (Wedding, Reception, Haldi) | Session |
| `POST` | `/api/events` | Create new wedding ceremony | Session |
| `GET` | `/api/gifts` | Filter shagun registry by event, guest, or gift type | Session |
| `POST` | `/api/gifts` | Record shagun envelope and generate reciprocity entry | Session |
| `DELETE`| `/api/gifts/:id` | Delete shagun gift record | Session |
| `GET` | `/api/reciprocity`| List pending and completed return obligations | Session |
| `PUT` | `/api/reciprocity`| Update reciprocity status (*RETURNED*, *PENDING*) | Session |
| `POST` | `/api/auth/register`| Register new family user account | Public |

---

## 🛠️ Installation & Getting Started

### Prerequisites
* **Node.js**: v18.17.0+ or v20.x
* **npm**: v9.x+

### Quick Setup

```bash
# 1. Clone repository
git clone https://github.com/raviattrash-pro/shagun-tracker.git
cd shagun-tracker

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local

# 4. Initialize Database & Push Schema
npx prisma db push
npm run db:seed

# 5. Start development server
npm run dev
```

Visit `http://localhost:3000` to view the traditional bahi-khata and live wedding registry.

---

## 🧪 Testing & Verification

The test suite runs on [Vitest](https://vitest.dev/) with automated unit tests for voice NLP parsing, currency calculations, and data validation:

```bash
# Run unit test suite
npm run test

# Run TypeScript type check
npm run type-check
```

```
✓ tests/unit/voice-parser.test.ts (4 tests)
✓ tests/unit/currency.test.ts     (4 tests)
✓ tests/unit/validators.test.ts   (4 tests)

Test Files  3 passed (3)
Tests       12 passed (12)
```

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
