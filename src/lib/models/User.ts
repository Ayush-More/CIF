import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    emailOtp: string;
    verified: Boolean;
    googleId?: string;
    facebookId?: string;
    createdAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String }, // Hashed password
        emailOtp: { type: String },
        verified: { type: Boolean, default: false },
        googleId: { type: String, default: null },
        facebookId: { type: String, default: null },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;