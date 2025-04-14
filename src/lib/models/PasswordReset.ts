import mongoose, { Schema, Document } from 'mongoose';

export interface IPasswordReset extends Document {
    email: string;
    otp: string;
    expiresAt: Date;
}

const PasswordResetSchema: Schema = new Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

const PasswordReset =
    mongoose.models.PasswordReset ||
    mongoose.model<IPasswordReset>('PasswordReset', PasswordResetSchema);

export default PasswordReset;