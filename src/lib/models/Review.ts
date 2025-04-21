import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IReview extends Document {
    care_id: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
    {
        care_id: {
            type: Schema.Types.ObjectId,
            ref: 'Care',
            required: true
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            default: 5
        },
        comment: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Add indexes for better query performance
ReviewSchema.index({ care_id: 1, createdAt: -1 });
ReviewSchema.index({ user_id: 1, createdAt: -1 });
ReviewSchema.index({ care_id: 1, user_id: 1 }, { unique: true });

const Review = models.Review || model<IReview>('Review', ReviewSchema);
export default Review;