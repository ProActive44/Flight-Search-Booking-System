"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBooking } from "@/lib/api";

interface FlightSummary {
    from: string;
    to: string;
    departure: string;
    arrival: string;
    airlines: string[];
    stops: number;
    price: string;
    brandName: string;
}

const TITLES = ["Mr", "Mrs", "Ms", "Dr"];
const NATIONALITIES = ["IN", "US", "GB", "AE", "SG", "AU"];

const emptyTraveller = {
    type: "ADT" as const,
    title: "Mr",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    passportNumber: "",
    passportExpiry: "",
    nationality: "IN",
};

export default function TravellerPage() {
    const router = useRouter();
    const [selectionId, setSelectionId] = useState<string | null>(null);
    const [summary, setSummary] = useState<FlightSummary | null>(null);
    const [traveller, setTraveller] = useState<{
        type: "ADT" | "CHD" | "INF";
        title: string;
        firstName: string;
        lastName: string;
        dateOfBirth: string;
        passportNumber: string;
        passportExpiry: string;
        nationality: string;
    }>({ ...emptyTraveller });
    const [contact, setContact] = useState({ email: "", phone: "" });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const id = sessionStorage.getItem("selectionId");
        const raw = sessionStorage.getItem("flightSummary");
        if (!id || !raw) {
            router.replace("/flights");
            return;
        }
        setSelectionId(id);
        setSummary(JSON.parse(raw));
    }, [router]);

    const formatTime = (iso: string) =>
        new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectionId) return;
        setSubmitting(true);
        setError(null);
        try {
            const json = await createBooking({
                selectionId,
                travellers: [traveller],
                contactInfo: contact,
            });
            if (json.success) {
                sessionStorage.setItem("bookingResult", JSON.stringify(json.data));
                router.push("/confirmation");
            }
        } catch {
            setError("Failed to create booking. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!summary) return null;

    return (
        <main className="min-h-screen bg-[var(--surface)]">
            <header className="bg-[var(--brand)] text-white py-4 px-6">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-xl font-bold tracking-tight">FlightBook</h1>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form */}
                <form onSubmit={handleSubmit} className="lg:col-span-2 flex flex-col gap-6">
                    {/* Traveller Details */}
                    <section className="bg-white border border-[var(--border)] rounded-2xl p-6">
                        <h2 className="text-base font-semibold mb-5">Traveller Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-[var(--text-secondary)]">Title</label>
                                <select
                                    value={traveller.title}
                                    onChange={(e) => setTraveller((t) => ({ ...t, title: e.target.value }))}
                                    className="border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm"
                                    required
                                >
                                    {TITLES.map((t) => <option key={t}>{t}</option>)}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-[var(--text-secondary)]">Type</label>
                                <select
                                    value={traveller.type}
                                    onChange={(e) => setTraveller((t) => ({ ...t, type: e.target.value as "ADT" | "CHD" | "INF" }))}
                                    className="border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm"
                                >
                                    <option value="ADT">Adult</option>
                                    <option value="CHD">Child</option>
                                    <option value="INF">Infant</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-[var(--text-secondary)]">First Name</label>
                                <input
                                    type="text"
                                    value={traveller.firstName}
                                    onChange={(e) => setTraveller((t) => ({ ...t, firstName: e.target.value }))}
                                    placeholder="As on passport"
                                    className="border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-[var(--text-secondary)]">Last Name</label>
                                <input
                                    type="text"
                                    value={traveller.lastName}
                                    onChange={(e) => setTraveller((t) => ({ ...t, lastName: e.target.value }))}
                                    placeholder="As on passport"
                                    className="border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-[var(--text-secondary)]">Date of Birth</label>
                                <input
                                    type="date"
                                    value={traveller.dateOfBirth}
                                    onChange={(e) => setTraveller((t) => ({ ...t, dateOfBirth: e.target.value }))}
                                    className="border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-[var(--text-secondary)]">Nationality</label>
                                <select
                                    value={traveller.nationality}
                                    onChange={(e) => setTraveller((t) => ({ ...t, nationality: e.target.value }))}
                                    className="border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm"
                                >
                                    {NATIONALITIES.map((n) => <option key={n}>{n}</option>)}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-[var(--text-secondary)]">Passport Number</label>
                                <input
                                    type="text"
                                    value={traveller.passportNumber}
                                    onChange={(e) => setTraveller((t) => ({ ...t, passportNumber: e.target.value.toUpperCase() }))}
                                    placeholder="A1234567"
                                    className="border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-[var(--text-secondary)]">Passport Expiry</label>
                                <input
                                    type="date"
                                    value={traveller.passportExpiry}
                                    onChange={(e) => setTraveller((t) => ({ ...t, passportExpiry: e.target.value }))}
                                    className="border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm"
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    {/* Contact Info */}
                    <section className="bg-white border border-[var(--border)] rounded-2xl p-6">
                        <h2 className="text-base font-semibold mb-5">Contact Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-[var(--text-secondary)]">Email</label>
                                <input
                                    type="email"
                                    value={contact.email}
                                    onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                                    placeholder="john@example.com"
                                    className="border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-[var(--text-secondary)]">Phone</label>
                                <input
                                    type="tel"
                                    value={contact.phone}
                                    onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                                    placeholder="9876543210"
                                    className="border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm"
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-lg">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white font-semibold py-3 px-8 rounded-xl transition-colors disabled:opacity-60 cursor-pointer"
                    >
                        {submitting ? "Confirming Booking..." : "Confirm Booking"}
                    </button>
                </form>

                {/* Flight Summary Sidebar */}
                <aside className="bg-white border border-[var(--border)] rounded-2xl p-5 h-fit">
                    <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-4">
                        Your Flight
                    </h2>
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold">{summary.from}</span>
                            <span className="text-xs text-[var(--text-secondary)] px-2">→</span>
                            <span className="text-2xl font-bold">{summary.to}</span>
                        </div>
                        <div className="text-sm text-[var(--text-secondary)]">
                            {formatDate(summary.departure)}
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>{formatTime(summary.departure)}</span>
                            <span className="text-[var(--text-secondary)]">–</span>
                            <span>{formatTime(summary.arrival)}</span>
                        </div>
                        <div className="text-xs text-[var(--text-secondary)]">
                            {summary.airlines.join(", ")} · {summary.stops === 0 ? "Non-stop" : `${summary.stops} stop`}
                        </div>
                        {summary.brandName && (
                            <div className="text-xs font-medium text-[var(--brand)]">{summary.brandName}</div>
                        )}
                        <div className="border-t border-[var(--border)] pt-3 mt-1">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-[var(--text-secondary)]">Price per adult</span>
                                <span className="text-lg font-bold text-[var(--brand)]">
                                    ₹{Number(summary.price).toLocaleString("en-IN")}
                                </span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}
