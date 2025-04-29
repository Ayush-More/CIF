import mongoose, { Document, Model, Schema } from 'mongoose';

// Interface for the Zoom Token document
export interface IZoomToken extends Document {
    token: string;
    createdAt: Date;
    updatedAt: Date;
}

// Schema definition
const ZoomTokenSchema = new Schema(
    {
        token: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt fields
    }
);

// Type for the Zoom Token model
type ZoomTokenModel = Model<IZoomToken>;

// Export the model
const ZoomToken: ZoomTokenModel = mongoose.models.ZoomToken || mongoose.model<IZoomToken>('ZoomToken', ZoomTokenSchema);

export default ZoomToken;