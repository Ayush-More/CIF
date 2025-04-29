import mongoose, { Document, Model, Types } from "mongoose";

export interface IMessage {
    id: Types.ObjectId;
    message: string;
    sender: string;
    status: number;
    created_at: Date;
}

export interface IChat extends Document {
    _id: Types.ObjectId;
    users: string[];
    messages: IMessage[];
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
    },
    message: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const ChatSchema = new mongoose.Schema({
    users: {
        type: [{
            type: String,
            required: true
        }],
        required: true
    },
    messages: {
        type: [MessageSchema],
        required: true,
        default: []
    }
}, {
    timestamps: true
});

const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema);

export default Chat;