import path from "path";
import fs from "fs";
import Selection, { ISelection } from "../models/selection.model";

let cachedData: Record<string, unknown> | null = null;

const getFlightData = (): Record<string, unknown> => {
    if (!cachedData) {
        const filePath = path.join(__dirname, "../data/flight.json");
        const raw = fs.readFileSync(filePath, "utf-8");
        cachedData = JSON.parse(raw);
    }
    return cachedData as Record<string, unknown>;
};

interface SelectFlightInput {
    searchId: string;
    journeyKey: string;
    flightId: string;
    fareId: string;
}

export const selectFlight = async (input: SelectFlightInput): Promise<ISelection> => {
    const { searchId, journeyKey, flightId, fareId } = input;

    const root = getFlightData() as any;
    const { journeys, sectors } = root.data.result;

    const sectorKey = journeys[journeyKey]?.sector;
    if (!sectorKey) throw new Error(`Journey key "${journeyKey}" not found`);

    const sectorGroup = sectors[sectorKey];
    if (!sectorGroup) throw new Error(`Sector "${sectorKey}" not found`);

    const flightOption = sectorGroup[flightId];
    if (!flightOption) throw new Error(`Flight "${flightId}" not found`);

    const selectedFare = flightOption.fares.find((f: any) => f.fareId === fareId);
    if (!selectedFare) throw new Error(`Fare "${fareId}" not found`);

    const selection = await Selection.create({
        searchId,
        journeyKey,
        selectedFlight: flightOption,
        selectedFare,
    });

    return selection;
};
