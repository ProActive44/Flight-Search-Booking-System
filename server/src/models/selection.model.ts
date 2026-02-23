import mongoose, { Document, Schema } from "mongoose";

export interface ISelection extends Document {
    searchId: string;
    journeyKey: string;
    selectedFlight: Record<string, unknown>;
    selectedFare: Record<string, unknown>;
    createdAt: Date;
}

const SelectionSchema = new Schema<ISelection>(
    {
        searchId: { type: String, required: true },
        journeyKey: { type: String, required: true },
        selectedFlight: { type: Schema.Types.Mixed, required: true },
        selectedFare: { type: Schema.Types.Mixed, required: true },
    },
    { timestamps: true }
);

const Selection = mongoose.model<ISelection>("Selection", SelectionSchema);

export default Selection;
