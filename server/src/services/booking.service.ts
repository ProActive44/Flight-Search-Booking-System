import mongoose from "mongoose";
import Booking, { IBooking, ITraveller, IContactInfo } from "../models/booking.model";
import Selection from "../models/selection.model";
import { generateBookingId } from "../utils/generateBookingId";

interface CreateBookingInput {
    selectionId: string;
    travellers: ITraveller[];
    contactInfo: IContactInfo;
}

export const createBooking = async (input: CreateBookingInput): Promise<IBooking> => {
    const { selectionId, travellers, contactInfo } = input;

    if (!mongoose.Types.ObjectId.isValid(selectionId)) {
        throw new Error("Invalid selectionId");
    }

    const selection = await Selection.findById(selectionId);
    if (!selection) {
        throw new Error("Selection not found. Please select a flight first.");
    }

    const fare = selection.selectedFare as any;
    const totalPrice = fare?.price?.CTC ?? "0";

    const booking = await Booking.create({
        bookingId: generateBookingId(),
        selectionId: selection._id,
        searchId: selection.searchId,
        selectedFlight: selection.selectedFlight,
        selectedFare: selection.selectedFare,
        travellers,
        contactInfo,
        status: "CONFIRMED",
        totalPrice,
    });

    return booking;
};
