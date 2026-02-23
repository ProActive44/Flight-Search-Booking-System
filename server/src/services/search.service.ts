import path from "path";
import fs from "fs";
import { FlightOption, SearchResult } from "../types/flight.types";

// Cache parsed JSON — 4MB file, we don't want to re-parse on every request
let cachedData: Record<string, unknown> | null = null;

const getFlightData = (): Record<string, unknown> => {
    if (!cachedData) {
        const filePath = path.join(__dirname, "../data/flight.json");
        const raw = fs.readFileSync(filePath, "utf-8");
        cachedData = JSON.parse(raw);
    }
    return cachedData as Record<string, unknown>;
};

export const searchFlights = (): SearchResult => {
    const root = getFlightData() as any;
    const { searchId, result } = root.data;
    const { journeys, sectors } = result;

    const journeyResults: Record<string, FlightOption[]> = {};

    for (const [journeyKey, journeyValue] of Object.entries(journeys)) {
        const sectorKey = (journeyValue as { sector: string }).sector;
        const sectorGroup = sectors[sectorKey];

        if (!sectorGroup) continue;

        const flightOptions: FlightOption[] = Object.values(sectorGroup).map(
            (option: any) => {
                const legs = option.flights;
                const firstLeg = legs[0];
                const lastLeg = legs[legs.length - 1];
                const totalDuration = legs.reduce(
                    (sum: number, leg: any) => sum + leg.durationInMin,
                    0
                );

                return {
                    flightId: option.flUnqiueId,
                    sectorKey,
                    from: firstLeg.departureAirport.code,
                    to: lastLeg.arrivalAirport.code,
                    departure: firstLeg.departureAirport.time,
                    arrival: lastLeg.arrivalAirport.time,
                    totalDuration,
                    stops: option.otherDetails.totalStops,
                    airlines: option.otherDetails.airline,
                    legs,
                    fares: option.fares,
                    lowestPrice: option.otherDetails.lowestPrice,
                };
            }
        );

        journeyResults[journeyKey] = flightOptions;
    }

    return { searchId, journeys: journeyResults };
};
