import { Request, Response } from "express";
import { createBooking } from "../services/booking.service";

export const book = async (req: Request, res: Response): Promise<void> => {
    const { selectionId, travellers, contactInfo } = req.body;

    if (!selectionId || !travellers?.length || !contactInfo?.email || !contactInfo?.phone) {
        res.status(400).json({
            success: false,
            message: "selectionId, travellers, contactInfo (email + phone) are required",
        });
        return;
    }

    try {
        const booking = await createBooking({ selectionId, travellers, contactInfo });
        const flight = booking.selectedFlight as any;

        res.status(201).json({
            success: true,
            data: {
                bookingId: booking.bookingId,
                status: booking.status,
                from: flight.flights[0].departureAirport.code,
                to: flight.flights[flight.flights.length - 1].arrivalAirport.code,
                departure: flight.flights[0].departureAirport.time,
                arrival: flight.flights[flight.flights.length - 1].arrivalAirport.time,
                airlines: flight.otherDetails.airline,
                stops: flight.otherDetails.totalStops,
                totalPrice: booking.totalPrice,
                travellers: booking.travellers,
                contactInfo: booking.contactInfo,
                createdAt: booking.createdAt,
            },
        });
    } catch (error: any) {
        const status = error.message.includes("not found") ? 404 : 500;
        res.status(status).json({ success: false, message: error.message });
    }
};
