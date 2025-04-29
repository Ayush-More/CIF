import mongoose, { Document, Model, Schema } from 'mongoose';

// Define interface for LastSeen document
export interface ILastSeen extends Document {
    user_id: mongoose.Types.ObjectId;
    lastSeen: Date;
    isOnline: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Define the LastSeen Schema
const LastSeenSchema = new Schema<ILastSeen>(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            required: true,
            unique: true,
            ref: 'Care' // Reference to Care model
        },
        lastSeen: {
            type: Date,
            default: () => new Date(), // Using function to ensure date is set at document creation
        },
        isOnline: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

// Create and export the model
const LastSeen: Model<ILastSeen> = mongoose.models.LastSeen || mongoose.model<ILastSeen>('LastSeen', LastSeenSchema);

export default LastSeen;