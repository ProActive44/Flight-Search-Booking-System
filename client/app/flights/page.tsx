"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { searchFlights } from "@/lib/api";
import { SearchResult, FlightOption } from "@/types/flight";
import SearchForm, { SearchFilters } from "@/components/SearchForm";
import FlightCard from "@/components/FlightCard";

// ── helpers ──────────────────────────────────────────────────
const getHour = (iso: string) => new Date(iso).getHours();

const defaultFilters: SearchFilters = {
    from: "DEL",
    to: "BLR",
    departureDate: "2026-01-31",
    returnDate: "",
    tripType: "one-way",
    passengers: 1,
    maxPrice: 100000,
    stops: "any",
    departureTimeStart: 0,
    departureTimeEnd: 23,
};

// ── component ─────────────────────────────────────────────────
export default function FlightsPage() {
    const router = useRouter();
    const [result, setResult] = useState<SearchResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeJourney, setActiveJourney] = useState("J1");
    const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
    const [hasSearched, setHasSearched] = useState(false);

    // ── search ──────────────────────────────────────────────
    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        try {
            const json = await searchFlights();
            setResult(json.data);
            setHasSearched(true);
        } catch {
            setError("Could not connect to the server. Make sure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    // ── select ──────────────────────────────────────────────
    const handleFlightSelected = (selectionId: string, summary: object) => {
        sessionStorage.setItem("selectionId", selectionId);
        sessionStorage.setItem("flightSummary", JSON.stringify(summary));
        router.push("/traveller");
    };

    // ── client-side filtering ────────────────────────────────
    const applyFilters = (flights: FlightOption[]): FlightOption[] => {
        return flights.filter((f) => {
            // Stops
            if (filters.stops !== "any") {
                if (filters.stops === "2+") {
                    if (f.stops < 2) return false;
                } else {
                    if (f.stops !== Number(filters.stops)) return false;
                }
            }

            // Price (lowest fare of this flight)
            const lowestFarePrice = Math.min(
                ...f.fares.map((fare) => Number(fare.price.pricePerAdult))
            );
            if (lowestFarePrice > filters.maxPrice) return false;

            // Departure time
            const hour = getHour(f.departure);
            if (hour < filters.departureTimeStart || hour > filters.departureTimeEnd) return false;

            return true;
        });
    };

    // ── derived data ─────────────────────────────────────────
    const journeyKeys = result ? Object.keys(result.journeys) : [];
    const rawFlights: FlightOption[] = result?.journeys[activeJourney] ?? [];
    const activeFlights = applyFilters(rawFlights);

    // Sort by lowest price
    const sorted = [...activeFlights].sort((a, b) => Number(a.lowestPrice) - Number(b.lowestPrice));

    return (
        <main className="min-h-screen bg-[var(--surface)]">
            {/* Header */}
            <header className="bg-[var(--brand)] text-white py-4 px-6">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-xl font-bold tracking-tight">FlightBook</h1>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
                {/* Search Form with all filters */}
                <SearchForm
                    filters={filters}
                    onFiltersChange={setFilters}
                    onSearch={handleSearch}
                    loading={loading}
                />

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Results */}
                {result && (
                    <div className="flex flex-col gap-4">
                        {/* Journey tabs (round-trip) */}
                        {journeyKeys.length > 1 && (
                            <div className="flex gap-2">
                                {journeyKeys.map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => setActiveJourney(key)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${activeJourney === key
                                                ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                                                : "bg-white text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--brand)]"
                                            }`}
                                    >
                                        {key === "J1" ? "Outbound" : "Return"} ({result.journeys[key].length} flights)
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Result count + summary */}
                        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                            <span>
                                <span className="font-semibold text-[var(--text-primary)]">{sorted.length}</span> of {rawFlights.length} flights shown
                            </span>
                            {filters.passengers > 1 && (
                                <span className="text-xs bg-[var(--surface)] border border-[var(--border)] px-2 py-0.5 rounded-full">
                                    {filters.passengers} passengers
                                </span>
                            )}
                        </div>

                        {/* Flight cards */}
                        {sorted.length > 0 ? (
                            sorted.map((flight) => (
                                <FlightCard
                                    key={flight.flightId}
                                    flight={flight}
                                    searchId={result.searchId}
                                    journeyKey={activeJourney}
                                    passengers={filters.passengers}
                                    onSelect={handleFlightSelected}
                                />
                            ))
                        ) : (
                            <div className="text-center py-16 text-[var(--text-secondary)]">
                                <p className="text-4xl mb-3">🔍</p>
                                <p className="font-medium">No flights match your filters</p>
                                <p className="text-sm mt-1">Try adjusting price range, stops, or departure time</p>
                            </div>
                        )}
                    </div>
                )}

                {!result && !loading && (
                    <div className="text-center py-20 text-[var(--text-secondary)]">
                        <p className="text-5xl mb-4">✈️</p>
                        <p className="text-lg font-medium">Set your filters and click Search Flights</p>
                        <p className="text-sm mt-1">We'll find the best options for you</p>
                    </div>
                )}
            </div>
        </main>
    );
}
