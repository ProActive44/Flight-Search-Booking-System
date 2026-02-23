"use client";

interface Props {
    onSearch: () => void;
    loading: boolean;
    from: string;
    to: string;
    date: string;
}

export default function SearchForm({ onSearch, loading, from, to, date }: Props) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
                        From
                    </label>
                    <input
                        type="text"
                        value={from}
                        readOnly
                        className="border border-[var(--border)] rounded-lg px-4 py-3 text-sm font-semibold bg-[var(--surface)] text-[var(--text-primary)] cursor-default"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
                        To
                    </label>
                    <input
                        type="text"
                        value={to}
                        readOnly
                        className="border border-[var(--border)] rounded-lg px-4 py-3 text-sm font-semibold bg-[var(--surface)] text-[var(--text-primary)] cursor-default"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
                        Departure
                    </label>
                    <input
                        type="text"
                        value={date}
                        readOnly
                        className="border border-[var(--border)] rounded-lg px-4 py-3 text-sm font-semibold bg-[var(--surface)] text-[var(--text-primary)] cursor-default"
                    />
                </div>

                <button
                    onClick={onSearch}
                    disabled={loading}
                    className="bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-60 cursor-pointer"
                >
                    {loading ? "Searching..." : "Search Flights"}
                </button>
            </div>
        </div>
    );
}
