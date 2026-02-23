const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const searchFlights = async () => {
    const res = await fetch(`${BASE_URL}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
    });
    if (!res.ok) throw new Error("Failed to fetch flights");
    return res.json();
};

export const selectFlight = async (payload: {
    searchId: string;
    journeyKey: string;
    flightId: string;
    fareId: string;
}) => {
    const res = await fetch(`${BASE_URL}/flight/select`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to select flight");
    return res.json();
};

export const createBooking = async (payload: {
    selectionId: string;
    travellers: unknown[];
    contactInfo: { email: string; phone: string };
}) => {
    const res = await fetch(`${BASE_URL}/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create booking");
    return res.json();
};
