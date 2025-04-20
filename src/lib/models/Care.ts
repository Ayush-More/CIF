// models/care.ts
import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ICare extends Document {
    user_id: mongoose.Types.ObjectId;
    category: 'childcare' | 'mentalphysical' | 'mealservice' | 'tutoring';
    workingDays: string[];
    timings: 'Daily' | 'Weekly' | 'Monthly';
    languages: {
        id: Number,
        name: string;
        proficiency: 'Beginner' | 'Intermediate' | 'Advanced';
    }[];
    hourlyRate: number;
    profilePic: string;
    username: string;
    gender: string;
    dateOfBirth: Date;
    about: string;
    skills: string;
    location: string;
    ratings: Number;
}

const CareSchema = new Schema<ICare>(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User', // <-- This tells Mongoose to reference the 'User' collection
        },
        category: {
            type: String,
            enum: ['childcare', 'mentalphysical', 'mealservice', 'tutoring'],
        },
        workingDays: {
            type: [String],
        },
        timings: {
            type: String,
            enum: ['Daily', 'Weekly', 'Monthly'],
        },
        languages: [
            {
                id: Number,
                language: { type: String },
                proficiency: {
                    type: String,
                    enum: ['Beginner', 'Intermediate', 'Advanced'],
                },
            },
        ],
        hourlyRate: {
            type: Number,
        },
        profilePic: {
            type: String,
            default: '',
        },
        username: {
            type: String,
        },
        gender: {
            type: String,
        },
        dateOfBirth: {
            type: Date,
        },
        about: {
            type: String,
        },
        skills: {
            type: String,
        },
        location: {
            type: String,
            default: "Mumbai"
        },
        ratings: {
            type: Number,
            default: 4.5
        },
    },
    { timestamps: true }
);

// Avoid model overwrite issues in dev
const Care = models.Care || model<ICare>('Care', CareSchema);
export default Care;
