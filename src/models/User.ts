import { model, Schema } from "mongoose";

interface IUser {
    _id: string;
    email: string;
    password: string;
    fullname: string;
    isActivated: boolean;
    activationLink: string;
}

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    isActivated: {
        type: Boolean,
        default: false,
    },
    activationLink: {
        type: String
    }
});

const UserModel = model<IUser>('User', UserSchema);

export { IUser, UserModel };