import mongoose, { Document, Schema } from "mongoose";

export interface ITraveller {
    type: "ADT" | "CHD" | "INF";
    title: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: "M" | "F" | "U";
    passportNumber?: string;
    passportExpiry?: string;
    nationality: string;
}

export interface IContactInfo {
    email: string;
    phone: string;
}

export interface IBooking extends Document {
    bookingId: string;
    selectionId: mongoose.Types.ObjectId;
    searchId: string;
    selectedFlight: Record<string, unknown>;
    selectedFare: Record<string, unknown>;
    travellers: ITraveller[];
    contactInfo: IContactInfo;
    status: "CONFIRMED" | "CANCELLED";
    totalPrice: string;
    createdAt: Date;
}

const TravellerSchema = new Schema<ITraveller>({
    type: { type: String, enum: ["ADT", "CHD", "INF"], required: true },
    title: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, enum: ["M", "F", "U"], required: true },
    passportNumber: { type: String, required: false, default: "" },
    passportExpiry: { type: String, required: false, default: "" },
    nationality: { type: String, required: true },
});

const BookingSchema = new Schema<IBooking>(
    {
        bookingId: { type: String, required: true, unique: true },
        selectionId: { type: Schema.Types.ObjectId, ref: "Selection", required: true },
        searchId: { type: String, required: true },
        selectedFlight: { type: Schema.Types.Mixed, required: true },
        selectedFare: { type: Schema.Types.Mixed, required: true },
        travellers: { type: [TravellerSchema], required: true },
        contactInfo: {
            email: { type: String, required: true },
            phone: { type: String, required: true },
        },
        status: { type: String, enum: ["CONFIRMED", "CANCELLED"], default: "CONFIRMED" },
        totalPrice: { type: String, required: true },
    },
    { timestamps: true }
);

const Booking = mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
