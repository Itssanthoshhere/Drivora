# 🚗 Drivora — Premium Car Rental App

A Premium, High-Fidelity Expo & React Native Application to Browse, Book, and Manage Your Car Rentals.

---

## 📋 Table of Contents

- [🚗 Drivora — Premium Car Rental App](#-drivora--premium-car-rental-app)
  - [📋 Table of Contents](#-table-of-contents)
  - [📖 About The Project](#-about-the-project)
  - [✨ Features](#-features)
    - [🔐 Authentication Gate](#-authentication-gate)
    - [📊 Dashboard \& Browsing](#-dashboard--browsing)
    - [🗓️ Booking Flow](#️-booking-flow)
    - [📈 User Profile \& Stats](#-user-profile--stats)
  - [🛠️ Tech Stack](#️-tech-stack)
  - [🏗️ Project Structure](#️-project-structure)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [🤝 Contributing](#-contributing)
  - [📜 License \& Attribution](#-license--attribution)

---

## 📖 About The Project

**Drivora** is a pixel-perfect, feature-rich car rental mobile app and backend system. Built on the modern Expo SDK 54 and backed by a robust Node.js/Prisma backend, it addresses the real-world challenge of seamless vehicle bookings by giving users an elegant control center to find cars, check real-time availability, manage bookings, and analyze their rental stats.

This project serves as a comprehensive study of:
- 🔑 Secure, identity-first auth integration with **JWT & Express**
- ⚡ Optimistic UI updates and state management with **Zustand**
- 🗄️ Robust database schema, migrations, and transactions via **Prisma** (PostgreSQL)
- 🛡️ Advanced API validation using **Zod**
- 🎨 Responsive, dark-themed hybrid layouts powered by **NativeWind** (TailwindCSS)

---

## ✨ Features

### 🔐 Authentication Gate
- Managed secure onboarding flows using custom **JWT-based Authentication**.
- Supports signup, secure login, and session preservation via **Expo Secure Store**.

### 📊 Dashboard & Browsing
- Dynamic list displaying available cars with real-time backend synchronization.
- Beautiful, modern UI featuring a consistent dark theme (`#0A0A0F`) with vibrant accent colors (`#E8500A` primary).
- Collapsible cards displaying car metadata (Brand, Model, Seats, Fuel Type, and sublocation).

### 🗓️ Booking Flow
- **Seamless Scheduling**: Choose pickup and return dates with automatic conflict resolution and overlap checking via Prisma Transactions with Serializable isolation.
- **Dynamic Pricing**: Real-time calculation switching between hourly and daily pricing tiers based on rental duration.
- **Booking Management**: Comprehensive tabbed interface (All, Confirmed, Active, Completed, Cancelled) to track all reservations.
- **Cancellation Engine**: Time-aware cancellation logic preventing refunds/cancellations less than 1 hour before pickup.

### 📈 User Profile & Stats
- Comprehensive profile dashboard featuring a dynamic avatar and user verification status.
- **Booking Statistics**: Aggregated user stats detailing Total, Active, Done, and Cancelled bookings.

---

## 🛠️ Tech Stack

| Category      | Technology         | Version | Purpose                                                |
| :------------ | :----------------- | :------ | :----------------------------------------------------- |
| **Framework** | Expo SDK           | 54.0.36 | Cross-platform build & deploy system                   |
| **Runtime**   | React Native       | 0.81.5  | Native mobile performance and widgets                  |
| **Styling**   | NativeWind         | 4.2.6   | Tailwind utility class compilation for React Native    |
| **State**     | Zustand            | 5.0.14  | Lightweight global client state caching                |
| **API Client**| Axios              | 1.18.1  | Data fetching and HTTP requests                        |
| **Backend**   | Node.js & Express  | 5.2.1   | High-performance backend API server                    |
| **ORM**       | Prisma             | 7.8.0   | Type-safe database client (PostgreSQL)                 |
| **Validation**| Zod                | 4.4.3   | Schema-based payload validation                        |

---

## 🏗️ Project Structure

```
drivora/
│
├── 📁 backend/                        # Node.js + Express API
│   ├── 📁 prisma/                     # Database schema & migrations
│   ├── 📁 src/                        # Backend domain architecture layers
│   │   ├── 📁 controllers/            # Route handlers & Zod validation
│   │   ├── 📁 middlewares/            # Auth & rate limiting
│   │   ├── 📁 routes/                 # API route definitions
│   │   └── 📁 services/               # Business logic & Prisma client queries
│   └── server.ts                      # Express application entry point
│
├── 📁 mobile/                         # Expo React Native App
│   ├── 📁 app/                        # Expo Router Screens & File Routing
│   │   ├── 📁 (auth)/                 # User identity screens (Sign In / Sign Up)
│   │   ├── 📁 (main)/                 # Main navigation (Home, Bookings, Profile)
│   │   └── _layout.tsx                # Root layout and authentication gate
│   ├── 📁 src/                        # Frontend domain layers
│   │   ├── 📁 components/             # Reusable UI widgets
│   │   ├── 📁 services/               # Axios API clients
│   │   ├── 📁 store/                  # Zustand stores (auth, booking)
│   │   ├── 📁 types/                  # TypeScript interfaces
│   │   └── 📁 utils/                  # Date formatting & utility helpers
│   └── tailwind.config.js             # NativeWind theme configuration
```

---

## 🚀 Getting Started

### Prerequisites
Ensure you have the following installed:
- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL database
- iOS Simulator or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Itssanthoshhere/Drivora.git
   cd Drivora
   ```

2. **Setup the Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env # Add your Postgres URI and JWT secret
   npm run db:migrate
   npm run dev
   ```

3. **Setup the Mobile App**
   ```bash
   cd ../mobile
   npm install
   npx expo start
   ```

Press `i` to launch the iOS simulator or `a` to launch the Android emulator.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add awesome new feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License & Attribution

This project is for educational and portfolio purposes.
