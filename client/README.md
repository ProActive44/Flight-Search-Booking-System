# Flight Booking System — Frontend

Next.js 15 client for the Flight Booking System. See the [root README](../README.md) for full project documentation.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000/flights](http://localhost:3000/flights)

## Environment

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Pages

| Route | Description |
|---|---|
| `/flights` | Search flights + apply filters + select a flight |
| `/traveller` | Enter traveller & contact details |
| `/confirmation` | Booking confirmation with reference ID |

## Key Components

| Component | Description |
|---|---|
| `SearchForm` | 8 interactive search filters |
| `FlightCard` | Flight card with live airline logos, fare selector |
