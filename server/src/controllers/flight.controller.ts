import { Request, Response } from "express";
import { selectFlight } from "../services/flight.service";

export const select = async (req: Request, res: Response): Promise<void> => {
    const { searchId, journeyKey, flightId, fareId } = req.body;

    if (!searchId || !journeyKey || !flightId || !fareId) {
        res.status(400).json({
            success: false,
            message: "searchId, journeyKey, flightId and fareId are required",
        });
        return;
    }

    try {
        const selection = await selectFlight({ searchId, journeyKey, flightId, fareId });
        const flight = selection.selectedFlight as any;
        const fare = selection.selectedFare as any;

        res.status(201).json({
            success: true,
            data: {
                selectionId: selection._id,
                from: flight.flights[0].departureAirport.code,
                to: flight.flights[flight.flights.length - 1].arrivalAirport.code,
                departure: flight.flights[0].departureAirport.time,
                arrival: flight.flights[flight.flights.length - 1].arrivalAirport.time,
                airlines: flight.otherDetails.airline,
                stops: flight.otherDetails.totalStops,
                price: fare.price.pricePerAdult,
                brandName: fare.fareIdentifiers.brandName,
            },
        });
    } catch (error: any) {
        res.status(404).json({ success: false, message: error.message });
    }
};
