# Flight Booking System

A full-stack flight booking app built with Next.js, Express, TypeScript, and MongoDB. The idea is to simulate what happens under the hood when you search and book a flight — from the search filters all the way to a booking confirmation with a reference ID.

## Live Demo

| | Link |
|---|---|
| **Frontend** | https://flight-search-booking-system.vercel.app/ |
| **Backend API** | https://flight-search-booking-system.onrender.com/api |

> The backend is hosted on Render's free tier, which spins down after inactivity. The first request after a period of no use can take **up to 1 minute** to respond while the server wakes up. Subsequent requests are fast.

---

## What it does

The app walks a user through a complete booking flow:

1. Search for flights using filters (city, date, stops, price, etc.)
2. Pick a flight and a fare class
3. Fill in traveller details
4. Get a confirmed booking with a unique booking ID

---

## Tech used

- **Frontend** — Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend** — Node.js + Express, TypeScript
- **Database** — MongoDB (via Mongoose)
- **Airline logos** — [pics.avs.io](https://pics.avs.io/) free CDN (just pass the IATA code)

---

## Architecture

Pretty straightforward three-tier setup:

```
Next.js  →  Express API  →  MongoDB
(3000)       (8000)
```

Flight data comes from a local `flight.json` file (normalized airline industry format). The backend parses it, the frontend filters it client-side.

---

## Running locally

You'll need Node.js 18+ and a MongoDB connection string (Atlas free tier works fine).

### Backend

```bash
cd server
npm install
```

Create `server/.env`:
```
MONGO_URI=your_mongodb_connection_string
PORT=8000
NODE_ENV=development
```

```bash
npm run dev
# runs on http://localhost:8000
```

Quick health check: `http://localhost:8000/api/health`

### Frontend

```bash
cd client
npm install
```

Create `client/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```bash
npm run dev
# runs on http://localhost:3000
```

Go to `http://localhost:3000/flights` to start.

---

## Pages

### `/flights` — Search & Results

The search form has these filters:

- Source and destination city (dropdown of IATA codes)
- Departure date
- Return date (only shows up for round trips)
- One-way vs. round-trip toggle
- Passenger count (1–9)
- Max price slider (₹3,000 – ₹1,00,000)
- Stops (any / non-stop / 1 stop / 2+ stops)
- Departure time range (pick a start and end hour)

All filtering happens client-side since the API always returns the same dataset. Results are sorted by lowest fare.

Each flight card shows:
- Real airline logo from the CDN (falls back to the IATA code badge if the image fails)
- Airline name and flight numbers
- Departure and arrival times with airport codes
- Total flight duration and stop count
- Selectable fare classes (Economy, Business, etc.) with refundable/baggage info
- Price per adult, plus total price if you've selected multiple passengers

### `/traveller` — Passenger Details

A two-section form:

**Traveller info:**
Title, type (Adult/Child/Infant), first and last name, date of birth, gender (pill toggle — Male/Female/Unspecified), nationality, and optionally passport number and expiry.

**Contact info:**
Email and phone.

There's a sidebar that keeps the selected flight summary visible while you fill the form.

### `/confirmation` — Booking Done

Shows the booking reference ID, full flight route details, traveller info (including gender), contact details, and the total amount paid. Has a "Book Another Flight" button that clears session and goes back to search.

---

## API endpoints

### `POST /api/search`

Returns the available flights by reading and normalising the local JSON file.

```json
// Response
{
  "success": true,
  "data": {
    "searchId": "DEL-BLR-...",
    "journeys": {
      "J1": [
        {
          "flightId": "...",
          "from": "DEL",
          "to": "BLR",
          "departure": "2026-01-31T19:45:00+05:30",
          "stops": 1,
          "fares": [...]
        }
      ]
    }
  }
}
```

### `POST /api/flight/select`

Saves the user's chosen flight + fare to MongoDB. Returns a `selectionId` that the booking step needs.

```json
// Request
{
  "searchId": "DEL-BLR-...",
  "journeyKey": "J1",
  "flightId": "DEL-AMD-AI-531_...",
  "fareId": "REGULAR_FARE-ECONOMY..."
}

// Response
{
  "success": true,
  "data": {
    "selectionId": "<ObjectId>",
    "from": "DEL",
    "to": "BLR",
    "price": "13366.54",
    "brandName": "ECONOMY"
  }
}
```

### `POST /api/booking`

Creates the booking. Looks up the selection from MongoDB, locks in the price (from the stored fare), generates a booking ID, and saves the full record.

```json
// Request
{
  "selectionId": "<ObjectId>",
  "travellers": [
    {
      "type": "ADT",
      "title": "Mr",
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-01-01",
      "gender": "M",
      "nationality": "IN",
      "passportNumber": "A1234567",   // optional
      "passportExpiry": "2030-01-01"  // optional
    }
  ],
  "contactInfo": {
    "email": "john@example.com",
    "phone": "9876543210"
  }
}

// Response
{
  "success": true,
  "data": {
    "bookingId": "BK-XXXXXXXX",
    "status": "CONFIRMED",
    "totalPrice": "13366.54",
    ...
  }
}
```

---

## Project structure

```
flight-booking-system/
├── client/
│   ├── app/
│   │   ├── flights/page.tsx        # search page
│   │   ├── traveller/page.tsx      # traveller form
│   │   └── confirmation/page.tsx   # booking confirmed
│   ├── components/
│   │   ├── SearchForm.tsx          # all 8 filters
│   │   └── FlightCard.tsx          # card with logo + fare picker
│   ├── lib/api.ts                  # fetch wrappers
│   └── types/flight.ts             # shared types
│
└── server/
    └── src/
        ├── index.ts                # express setup
        ├── data/flight.json        # source flight data
        ├── models/                 # Selection + Booking mongoose models
        ├── controllers/            # request handlers
        ├── services/               # business logic
        └── routes/                 # route definitions
```

---

## Notes

- No auth is implemented — this is intentional per the assignment scope
- The flight data is always the same (DEL → BLR, 31 Jan 2026) since it comes from a fixed JSON file
- Passport fields are optional in the form and the database schema
- Gender is stored as `"M"`, `"F"`, or `"U"` in the DB and displayed as a label on the confirmation screen
