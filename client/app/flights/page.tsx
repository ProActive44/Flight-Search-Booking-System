"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { searchFlights } from "@/lib/api";
import { SearchResult, FlightOption } from "@/types/flight";
import SearchForm from "@/components/SearchForm";
import FlightCard from "@/components/FlightCard";

export default function FlightsPage() {
    const router = useRouter();
    const [result, setResult] = useState<SearchResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeJourney, setActiveJourney] = useState("J1");

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        try {
            const json = await searchFlights();
            setResult(json.data);
        } catch {
            setError("Could not connect to the server. Make sure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const handleFlightSelected = (selectionId: string, summary: object) => {
        sessionStorage.setItem("selectionId", selectionId);
        sessionStorage.setItem("flightSummary", JSON.stringify(summary));
        router.push("/traveller");
    };

    const parseSearchId = (searchId: string) => {
        const parts = searchId.split("-");
        return {
            from: parts[0] ?? "DEL",
            to: parts[1] ?? "DXB",
            date: parts[3] ? `${parts[3].slice(6, 8)} ${new Date(parts[3]).toLocaleString("en-IN", { month: "short" })} ${parts[3].slice(0, 4)}` : "",
        };
    };

    const info = result ? parseSearchId(result.searchId) : { from: "DEL", to: "DXB", date: "02 Mar 2026" };
    const journeyKeys = result ? Object.keys(result.journeys) : [];
    const activeFlights: FlightOption[] = result?.journeys[activeJourney] ?? [];

    return (
        <main className="min-h-screen bg-[var(--surface)]">
            {/* Header */}
            <header className="bg-[var(--brand)] text-white py-4 px-6">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-xl font-bold tracking-tight">FlightBook</h1>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
                {/* Search Form */}
                <SearchForm
                    onSearch={handleSearch}
                    loading={loading}
                    from={info.from}
                    to={info.to}
                    date={info.date}
                />

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Results */}
                {result && (
                    <div className="flex flex-col gap-4">
                        {/* Journey tabs */}
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

                        <p className="text-sm text-[var(--text-secondary)]">
                            {activeFlights.length} flights found
                        </p>

                        {activeFlights.map((flight) => (
                            <FlightCard
                                key={flight.flightId}
                                flight={flight}
                                searchId={result.searchId}
                                journeyKey={activeJourney}
                                onSelect={handleFlightSelected}
                            />
                        ))}
                    </div>
                )}

                {!result && !loading && (
                    <div className="text-center py-20 text-[var(--text-secondary)]">
                        <p className="text-lg font-medium">Click Search Flights to load available options</p>
                    </div>
                )}
            </div>
        </main>
    );
}
