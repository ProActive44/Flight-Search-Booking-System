"use client";

import { useState } from "react";
import { FlightOption, Fare } from "@/types/flight";

interface Props {
    flight: FlightOption;
    searchId: string;
    journeyKey: string;
    onSelect: (selectionId: string, summary: object) => void;
}

const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });

const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
};

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

export default function FlightCard({ flight, searchId, journeyKey, onSelect }: Props) {
    const [selectedFare, setSelectedFare] = useState<Fare>(flight.fares[0]);
    const [selecting, setSelecting] = useState(false);

    const handleSelect = async () => {
        setSelecting(true);
        try {
            const res = await fetch("http://localhost:8000/api/flight/select", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    searchId,
                    journeyKey,
                    flightId: flight.flightId,
                    fareId: selectedFare.fareId,
                }),
            });
            const json = await res.json();
            if (json.success) {
                onSelect(json.data.selectionId, json.data);
            }
        } finally {
            setSelecting(false);
        }
    };

    return (
        <div className="bg-white border border-[var(--border)] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            {/* Flight summary row */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-xs font-bold text-[var(--brand)]">
                        {flight.airlines[0]}
                    </div>
                    <div>
                        <p className="text-xs text-[var(--text-secondary)]">{flight.airlines.join(", ")}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{flight.legs.map(l => l.fltNo).join(" · ")}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <p className="text-xl font-bold">{formatTime(flight.departure)}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{flight.from} · {formatDate(flight.departure)}</p>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <p className="text-xs text-[var(--text-secondary)]">{formatDuration(flight.totalDuration)}</p>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-[var(--brand)]" />
                            <div className="w-20 h-px bg-[var(--border)]" />
                            {flight.stops > 0 && (
                                <div className="w-2 h-2 rounded-full border-2 border-[var(--brand)] bg-white" />
                            )}
                            <div className="w-20 h-px bg-[var(--border)]" />
                            <div className="w-2 h-2 rounded-full bg-[var(--brand)]" />
                        </div>
                        <p className="text-xs text-[var(--text-secondary)]">
                            {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}
                        </p>
                    </div>

                    <div className="text-center">
                        <p className="text-xl font-bold">{formatTime(flight.arrival)}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{flight.to} · {formatDate(flight.arrival)}</p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-2xl font-bold text-[var(--brand)]">
                        ₹{Number(selectedFare.price.pricePerAdult).toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">per adult</p>
                </div>
            </div>

            {/* Fare selector */}
            <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--border)] pt-4">
                {flight.fares.map((fare) => (
                    <button
                        key={fare.fareId}
                        onClick={() => setSelectedFare(fare)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${selectedFare.fareId === fare.fareId
                                ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                                : "bg-white text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--brand)]"
                            }`}
                    >
                        {fare.fareIdentifiers.brandName}
                    </button>
                ))}

                <div className="ml-auto flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                    {selectedFare.refundable && <span className="text-[var(--success)] font-medium">Refundable</span>}
                    {selectedFare.checkInBaggageAllowed && <span>Check-in baggage</span>}
                    <span>{selectedFare.fareIdentifiers.availableSeatCount} seats left</span>
                </div>
            </div>

            {/* Select button */}
            <div className="mt-3 flex justify-end">
                <button
                    onClick={handleSelect}
                    disabled={selecting}
                    className="bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-60 cursor-pointer"
                >
                    {selecting ? "Selecting..." : "Select Flight"}
                </button>
            </div>
        </div>
    );
}
