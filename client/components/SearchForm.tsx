"use client";

export interface SearchFilters {
    from: string;
    to: string;
    departureDate: string;
    returnDate: string;
    tripType: "one-way" | "round-trip";
    passengers: number;
    maxPrice: number;
    stops: "any" | "0" | "1" | "2+";
    departureTimeStart: number; // hour 0-23
    departureTimeEnd: number;   // hour 0-23
}

interface Props {
    filters: SearchFilters;
    onFiltersChange: (filters: SearchFilters) => void;
    onSearch: () => void;
    loading: boolean;
}

const CITIES = ["DEL", "BLR", "BOM", "AMD", "HYD", "MAA", "CCU", "GOI", "COK", "PNQ"];

export default function SearchForm({ filters, onFiltersChange, onSearch, loading }: Props) {
    const set = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) =>
        onFiltersChange({ ...filters, [key]: value });

    const formatHour = (h: number) => {
        const period = h < 12 ? "AM" : "PM";
        const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
        return `${display}:00 ${period}`;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
            {/* Top bar — main search */}
            <div className="p-6 border-b border-[var(--border)]">
                {/* Trip type */}
                <div className="flex gap-3 mb-5">
                    {(["one-way", "round-trip"] as const).map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => set("tripType", t)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer ${filters.tripType === t
                                    ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                                    : "bg-white text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--brand)]"
                                }`}
                        >
                            {t === "one-way" ? "One Way" : "Round Trip"}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                    {/* From */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
                            From
                        </label>
                        <select
                            value={filters.from}
                            onChange={(e) => set("from", e.target.value)}
                            className="border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm font-semibold bg-white focus:outline-none focus:border-[var(--brand)] cursor-pointer"
                        >
                            {CITIES.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    {/* To */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
                            To
                        </label>
                        <select
                            value={filters.to}
                            onChange={(e) => set("to", e.target.value)}
                            className="border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm font-semibold bg-white focus:outline-none focus:border-[var(--brand)] cursor-pointer"
                        >
                            {CITIES.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    {/* Departure date */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
                            Departure
                        </label>
                        <input
                            type="date"
                            value={filters.departureDate}
                            onChange={(e) => set("departureDate", e.target.value)}
                            className="border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[var(--brand)] cursor-pointer"
                        />
                    </div>

                    {/* Return date or Passengers */}
                    {filters.tripType === "round-trip" ? (
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
                                Return
                            </label>
                            <input
                                type="date"
                                value={filters.returnDate}
                                onChange={(e) => set("returnDate", e.target.value)}
                                min={filters.departureDate}
                                className="border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[var(--brand)] cursor-pointer"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
                                Passengers
                            </label>
                            <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => set("passengers", Math.max(1, filters.passengers - 1))}
                                    className="px-3 py-2.5 text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-colors cursor-pointer text-lg leading-none"
                                >
                                    −
                                </button>
                                <span className="flex-1 text-center text-sm font-semibold">{filters.passengers}</span>
                                <button
                                    type="button"
                                    onClick={() => set("passengers", Math.min(9, filters.passengers + 1))}
                                    className="px-3 py-2.5 text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-colors cursor-pointer text-lg leading-none"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Row 2: Passengers (round-trip mode) */}
                {filters.tripType === "round-trip" && (
                    <div className="mt-3 flex items-center gap-4">
                        <div className="flex flex-col gap-1 w-48">
                            <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
                                Passengers
                            </label>
                            <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => set("passengers", Math.max(1, filters.passengers - 1))}
                                    className="px-3 py-2.5 text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-colors cursor-pointer text-lg leading-none"
                                >
                                    −
                                </button>
                                <span className="flex-1 text-center text-sm font-semibold">{filters.passengers}</span>
                                <button
                                    type="button"
                                    onClick={() => set("passengers", Math.min(9, filters.passengers + 1))}
                                    className="px-3 py-2.5 text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-colors cursor-pointer text-lg leading-none"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    type="button"
                    onClick={onSearch}
                    disabled={loading}
                    className="mt-4 w-full bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-60 cursor-pointer"
                >
                    {loading ? "Searching..." : "Search Flights"}
                </button>
            </div>

            {/* Bottom bar — result filters */}
            <div className="px-6 py-4 bg-[var(--surface)] flex flex-wrap gap-6 items-start">
                {/* Stops */}
                <div className="flex flex-col gap-2 min-w-[160px]">
                    <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Stops</p>
                    <div className="flex flex-wrap gap-2">
                        {([
                            { value: "any", label: "Any" },
                            { value: "0", label: "Non-stop" },
                            { value: "1", label: "1 Stop" },
                            { value: "2+", label: "2+ Stops" },
                        ] as const).map(({ value, label }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => set("stops", value)}
                                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${filters.stops === value
                                        ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                                        : "bg-white text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--brand)]"
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price range */}
                <div className="flex flex-col gap-2 min-w-[200px] flex-1">
                    <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                        Max Price: <span className="text-[var(--text-primary)]">₹{filters.maxPrice.toLocaleString("en-IN")}</span>
                    </p>
                    <input
                        type="range"
                        min={3000}
                        max={100000}
                        step={500}
                        value={filters.maxPrice}
                        onChange={(e) => set("maxPrice", Number(e.target.value))}
                        className="w-full accent-[var(--brand)] cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                        <span>₹3,000</span>
                        <span>₹1,00,000</span>
                    </div>
                </div>

                {/* Departure time range */}
                <div className="flex flex-col gap-2 min-w-[220px]">
                    <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                        Departure Time: <span className="text-[var(--text-primary)]">{formatHour(filters.departureTimeStart)} – {formatHour(filters.departureTimeEnd)}</span>
                    </p>
                    <div className="flex items-center gap-2">
                        <input
                            type="range"
                            min={0}
                            max={filters.departureTimeEnd - 1}
                            step={1}
                            value={filters.departureTimeStart}
                            onChange={(e) => set("departureTimeStart", Number(e.target.value))}
                            className="w-full accent-[var(--brand)] cursor-pointer"
                        />
                        <input
                            type="range"
                            min={filters.departureTimeStart + 1}
                            max={23}
                            step={1}
                            value={filters.departureTimeEnd}
                            onChange={(e) => set("departureTimeEnd", Number(e.target.value))}
                            className="w-full accent-[var(--brand)] cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
