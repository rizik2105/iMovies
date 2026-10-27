<div align="center">

# 🎬 IMovies
### Online Movie Ticket Booking & Cinema Reservation Platform

[![MERN Stack](https://img.shields.io/badge/Stack-MERN%20(React%20%2B%20Express%20%2B%20Mongo)-e50914?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Frontend-Vite%208-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%2024-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%208-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com)
[![JWT Auth](https://img.shields.io/badge/Auth-Stateless%20JWT-000000?style=for-the-badge&logo=jsonwebtokens)](https://jwt.io)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

*A full-stack, enterprise-grade cinema ticketing system built according to strict Software Requirements Specifications (SRS v1.0). Features real-time atomic seat reservations, 5-minute countdown holds to prevent double-booking, multiplex show schedules, mock payment gateway, printable QR e-tickets, and an administrative control center.*

[Explore Features](#-features) • [System Architecture](#-system-architecture) • [Demo Walkthrough](#-demo-video--preview) • [Quickstart Guide](#-quickstart-guide) • [API Reference](#-rest-api-specification)

---

</div>

## 📽️ Demo Video & Preview

> Experience smooth seat selection, atomic race condition prevention, and digital QR boarding passes.

<div align="center">
  <img src="./demo_walkthrough.webp" alt="IMovies Demo Walkthrough" width="100%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />
</div>

---

## ✨ Features

### 🍿 For Movie-Goers (Customers)
- **Cinematic Discovery**: Discover trending premieres, search by title, cast, or director, and filter by genre (*Action, Sci-Fi, Thriller, Animation, etc.*) and audio language.
- **Multiplex Showtimes**: Filter shows by city (*Mumbai, Bengaluru, Delhi NCR*) and date with real-time auditorium formats (*IMAX Laser 3D, Dolby Atmos 4K, Onyx Cinema LED*).
- **Interactive Seat Map**:
  - Realistic curved cinema screen projection with ambient glow reflection.
  - Color-coded seat states: 🟢 **Available**, 🔵 **Selected**, 🟠 **Locked (In Checkout)**, ⚪ **Booked**.
  - Multi-tier seat categories (*Recliner, Premium, Regular*) with live running subtotal calculation.
- **Atomic 5-Minute Seat Lock**:
  - Automatically isolates chosen seats exclusively to the user's account for 5 minutes during checkout.
  - Real-time countdown timer alerts the user if session is expiring.
  - Released holds are automatically returned to public availability.
- **Digital E-Tickets with QR Code**:
  - Instant generation of unique references (`IMV-XXXX-XXXX`) and high-resolution SVG QR codes for contactless entrance.
  - Printable / savable e-ticket boarding pass.
- **Flexible Cancellations**:
  - Cancel tickets up to 2 hours before showtime with automatic seat release and simulated refund.

### 🛡️ For Cinema Operators (Admin Portal)
- **Live Business Dashboard**: Aggregated gross box office revenue, ticket volume, active titles, and top-selling movies leaderboard.
- **Catalogue CRUD**: Create, edit, and delete movies with high-res posters, official YouTube trailer embeds, runtimes, and ratings.
- **Theatres & Auditoriums**: Configure multiplex venues and build custom row/seat grids.
- **Schedule Overlap Prevention**: Algorithmically detects and blocks conflicting showtimes scheduled on the same auditorium screen.
- **Transaction Ledger**: Filter and audit all customer reservations across the platform.

---

## 🏗️ System Architecture

```mermaid
graph TD
    Client["React 19 SPA (Vite + Bootstrap)"] -->|HTTPS / REST API| Server["Node.js & Express API Server"]
    Server -->|JWT Auth Middleware| Auth["Stateless JWT / bcryptjs"]
    Server -->|Atomic Conditionals| SeatLock["Seat Lock & Booking Service"]
    Server -->|Periodic Cleanup Job| Cron["releaseExpiredLocks Job"]
    Server -->|Mongoose ODM| DB[("MongoDB Database")]
    
    subgraph Data Models
        DB --> Users["Users Collection"]
        DB --> Movies["Movies Collection"]
        DB --> Theatres["Theatres & Screens"]
        DB --> Shows["Shows (Embedded Seats)"]
        DB --> Bookings["Bookings Collection"]
    end
```

---

## 🔒 Atomic Double-Booking Prevention

Concurrency safety is guaranteed at the database level using a single atomic conditional update:

```javascript
// Atomically locks seats only if NONE of the requested seats are booked or held by another user
const updateResult = await Show.updateOne(
  {
    _id: showId,
    seats: {
      $not: {
        $elemMatch: {
          seatId: { $in: seatIds },
          $or: [
            { status: 'booked' },
            {
              status: 'locked',
              lockedBy: { $ne: userId },
              lockExpiresAt: { $gt: new Date() },
            },
          ],
        },
      },
    },
  },
  {
    $set: {
      'seats.$[elem].status': 'locked',
      'seats.$[elem].lockedBy': userId,
      'seats.$[elem].lockExpiresAt': lockExpiresAt,
    },
  },
  {
    arrayFilters: [{ 'elem.seatId': { $in: seatIds } }],
  }
);
```

Two simultaneous requests for the exact same seat will strictly result in **exactly one 200 OK and one 409 Conflict** (`unavailable: [...]`).

---

## 🔑 Pre-Configured Test Credentials

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Cinema Admin** | `admin@imovies.com` | `Admin@12345` | Complete platform operator controls |
| **Customer Demo** | `user@imovies.com` | `User@12345` | Ticket reservations, live seat map, e-tickets |

*(Tip: 1-click login buttons are provided directly on the `/login` screen)*

---

## 📋 REST API Specification

### 🔐 Authentication & Users
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new customer account |
| `POST` | `/api/auth/login` | Public | Login with email/password and obtain JWT token |
| `GET` | `/api/auth/me` | User | Get current logged-in profile |
| `PUT` | `/api/users/me` | User | Update profile name and password |

### 🎬 Movies & Showtimes
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/movies` | Public | List movies with pagination, genre, language, status filters |
| `GET` | `/api/movies/:id` | Public | Detailed movie synopsis, cast, rating |
| `GET` | `/api/movies/:id/shows` | Public | Showtimes grouped by theatre & date |
| `POST` | `/api/movies` | Admin | Create movie in catalogue |
| `PUT` | `/api/movies/:id` | Admin | Update movie details |
| `DELETE`| `/api/movies/:id` | Admin | Delete movie |

### 🎟️ Seats & Bookings
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/shows/:id` | Public | Fetch live seat map for auditorium show |
| `POST` | `/api/shows/:id/lock` | User | Atomically hold seats for 5 minutes |
| `POST` | `/api/shows/:id/unlock` | User | Explicitly release held seats |
| `POST` | `/api/bookings` | User | Confirm booking and execute mock payment |
| `GET` | `/api/bookings/my` | User | Customer reservation history |
| `GET` | `/api/bookings/:id` | User | View digital e-ticket with QR code |
| `PUT` | `/api/bookings/:id/cancel`| User | Cancel booking (up to 2h before show) |

### 📊 Admin Portal
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Admin | Box office revenue, top movies, booking stats |
| `GET` | `/api/admin/bookings` | Admin | Filterable platform reservation ledger |
| `POST` | `/api/shows` | Admin | Schedule show with collision/overlap validation |
| `POST` | `/api/theatres` | Admin | Create multiplex venue |

---

## 🚀 Quickstart Guide (1-Click Laptop Compatible)

### 1. 1-Click Launch on Windows Laptop (Recommended)
Simply double click:
```cmd
start-imovies.bat
```
*(or `run.bat`)*

This script automatically:
- Checks and starts local MongoDB in user space (no administrator rights needed)
- Auto-seeds movies, theatres, screens, and demo accounts if the database is empty
- Starts the Express API server and Vite client concurrently
- Automatically opens [http://localhost:5173](http://localhost:5173) in your default web browser

---

### 2. Manual Terminal Start
```bash
# In project root:
npm run dev
```

- **Client App**: [http://localhost:5173](http://localhost:5173)
- **API Server**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📄 License
This project is licensed under the MIT License.
