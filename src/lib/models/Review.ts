import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IReview extends Document {
    care_id: mongoose.Types.ObjectId; // Reference to the Care provider
    user_id: mongoose.Types.ObjectId; // Reference to the User who wrote the review
    rating: number; // Rating (1-5)
    comment: string; // Review comment
    createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
    {
        care_id: {
            type: Schema.Types.ObjectId,
            ref: 'Care',
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Review = models.Review || model<IReview>('Review', ReviewSchema);
export default Review;