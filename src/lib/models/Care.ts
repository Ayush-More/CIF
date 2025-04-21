import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ICare extends Document {
    user_id?: mongoose.Types.ObjectId;
    category?: 'childcare' | 'mentalphysical' | 'mealservice' | 'tutoring';
    workingDays?: string[];
    timings?: 'Daily' | 'Weekly' | 'Monthly';
    languages?: {
        name: string;
        proficiency: 'Beginner' | 'Intermediate' | 'Advanced';
    }[];
    hourlyRate?: number;
    profilePic?: string;
    username?: string;
    gender?: string;
    dateOfBirth?: Date;
    about?: string;
    skills?: string;
    location?: string;
    ratings?: number;

    // New fields from CareFormContext
    zipCode?: string;
    experience?: string;

    // Tutoring specific fields
    mode?: string;

    // Child care specific fields
    schoolDrop?: boolean;
    smoking?: boolean;
    overnightCare?: boolean;
    ageBand?: string;
    jobTiming?: string;
    careFor?: number;

    // Meal service specific fields
    travelDistance?: string;
    serviceType?: string;
    mealPrice?: string;
    offerSubscription?: boolean;
    mealTypes?: string[];
}

const CareSchema = new Schema<ICare>(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false
        },
        category: {
            type: String,
            enum: ['childcare', 'mentalphysical', 'mealservice', 'tutoring'],
            required: false
        },
        workingDays: {
            type: [String],
            required: false
        },
        timings: {
            type: String,
            enum: ['Daily', 'Weekly', 'Monthly'],
            required: false
        },
        languages: [{
            name: { type: String },
            proficiency: {
                type: String,
                enum: ['Beginner', 'Intermediate', 'Advanced']
            }
        }],
        hourlyRate: {
            type: Number,
            required: false
        },
        profilePic: {
            type: String,
            default: '',
            required: false
        },
        username: {
            type: String,
            required: false
        },
        gender: {
            type: String,
            required: false
        },
        dateOfBirth: {
            type: Date,
            required: false
        },
        about: {
            type: String,
            required: false
        },
        skills: {
            type: String,
            required: false
        },
        location: {
            type: String,
            default: "Mumbai",
            required: false
        },
        ratings: {
            type: Number,
            default: 4.5,
            required: false
        },

        // New fields from CareFormContext
        zipCode: {
            type: String,
            required: false
        },
        experience: {
            type: String,
            required: false
        },

        // Tutoring specific fields
        mode: {
            type: String,
            required: false
        },

        // Child care specific fields
        schoolDrop: {
            type: Boolean,
            required: false
        },
        smoking: {
            type: Boolean,
            required: false
        },
        overnightCare: {
            type: Boolean,
            required: false
        },
        ageBand: {
            type: String,
            required: false
        },
        jobTiming: {
            type: String,
            required: false
        },
        careFor: {
            type: Number,
            required: false
        },

        // Meal service specific fields
        travelDistance: {
            type: String,
            required: false
        },
        serviceType: {
            type: String,
            required: false
        },
        mealPrice: {
            type: String,
            required: false
        },
        offerSubscription: {
            type: Boolean,
            required: false
        },
        mealTypes: {
            type: [String],
            required: false
        }
    },
    { timestamps: true }
);

// Avoid model overwrite issues in dev
const Care = models.Care || model<ICare>('Care', CareSchema);
export default Care;