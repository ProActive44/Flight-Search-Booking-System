"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface BookingResult {
    bookingId: string;
    status: string;
    from: string;
    to: string;
    departure: string;
    arrival: string;
    airlines: string[];
    stops: number;
    totalPrice: string;
    travellers: {
        type: string;
        title: string;
        firstName: string;
        lastName: string;
        gender: string;
        passportNumber: string;
        nationality: string;
    }[];
    contactInfo: { email: string; phone: string };
    createdAt: string;
}

export default function ConfirmationPage() {
    const router = useRouter();
    const [booking, setBooking] = useState<BookingResult | null>(null);

    useEffect(() => {
        const raw = sessionStorage.getItem("bookingResult");
        if (!raw) {
            router.replace("/flights");
            return;
        }
        setBooking(JSON.parse(raw));
    }, [router]);

    const formatTime = (iso: string) =>
        new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

    if (!booking) return null;

    return (
        <main className="min-h-screen bg-[var(--surface)]">
            <header className="bg-[var(--brand)] text-white py-4 px-6">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-xl font-bold tracking-tight">FlightBook</h1>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col gap-6">
                {/* Status Banner */}
                <div className="bg-white border border-[var(--border)] rounded-2xl p-6 flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-[var(--success)]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-lg font-bold">Booking Confirmed</p>
                        <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                            Your booking reference is{" "}
                            <span className="font-mono font-semibold text-[var(--text-primary)]">{booking.bookingId}</span>
                        </p>
                    </div>
                    <div className="ml-auto text-right hidden sm:block">
                        <p className="text-xs text-[var(--text-secondary)]">Booked on</p>
                        <p className="text-sm font-medium">{formatDate(booking.createdAt)}</p>
                    </div>
                </div>

                {/* Flight Details */}
                <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
                    <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-5">
                        Flight Details
                    </h2>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="text-center">
                            <p className="text-3xl font-bold">{formatTime(booking.departure)}</p>
                            <p className="text-sm text-[var(--text-secondary)] mt-1">{booking.from}</p>
                            <p className="text-xs text-[var(--text-secondary)]">{formatDate(booking.departure)}</p>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <p className="text-xs text-[var(--text-secondary)]">
                                {booking.stops === 0 ? "Non-stop" : `${booking.stops} stop`}
                            </p>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-[var(--brand)]" />
                                <div className="w-24 sm:w-36 h-px bg-[var(--border)]" />
                                <div className="w-2 h-2 rounded-full bg-[var(--brand)]" />
                            </div>
                            <p className="text-xs text-[var(--text-secondary)]">{booking.airlines.join(", ")}</p>
                        </div>

                        <div className="text-center">
                            <p className="text-3xl font-bold">{formatTime(booking.arrival)}</p>
                            <p className="text-sm text-[var(--text-secondary)] mt-1">{booking.to}</p>
                            <p className="text-xs text-[var(--text-secondary)]">{formatDate(booking.arrival)}</p>
                        </div>
                    </div>
                </div>

                {/* Traveller Details */}
                <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
                    <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-5">
                        Traveller Details
                    </h2>
                    {booking.travellers.map((t, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-[var(--border)] last:border-0">
                            <div>
                                <p className="text-sm font-semibold">
                                    {t.title} {t.firstName} {t.lastName}
                                </p>
                                <p className="text-xs text-[var(--text-secondary)]">
                                    {t.type}
                                    {t.gender ? ` · ${t.gender === "M" ? "Male" : t.gender === "F" ? "Female" : "Unspecified"}` : ""}
                                    {t.nationality ? ` · ${t.nationality}` : ""}
                                    {t.passportNumber ? ` · ${t.passportNumber}` : ""}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div className="mt-4 pt-4 border-t border-[var(--border)] flex flex-col gap-1">
                        <p className="text-xs text-[var(--text-secondary)]">Contact</p>
                        <p className="text-sm">{booking.contactInfo.email} · {booking.contactInfo.phone}</p>
                    </div>
                </div>

                {/* Price Summary */}
                <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
                    <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-4">
                        Price Summary
                    </h2>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-[var(--text-secondary)]">Total Amount Paid</span>
                        <span className="text-2xl font-bold text-[var(--brand)]">
                            ₹{Number(booking.totalPrice).toLocaleString("en-IN")}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center">
                    <button
                        onClick={() => {
                            sessionStorage.clear();
                            router.push("/flights");
                        }}
                        className="bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white font-semibold py-3 px-8 rounded-xl transition-colors cursor-pointer"
                    >
                        Book Another Flight
                    </button>
                </div>
            </div>
        </main>
    );
}
