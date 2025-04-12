import mongoose from "mongoose";
declare const user: mongoose.Model<{
    createdAt: NativeDate;
    email: string;
    displayName?: string;
    photoURL?: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    email: string;
    displayName?: string;
    photoURL?: string;
}> & {
    createdAt: NativeDate;
    email: string;
    displayName?: string;
    photoURL?: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    createdAt: NativeDate;
    email: string;
    displayName?: string;
    photoURL?: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    email: string;
    displayName?: string;
    photoURL?: string;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    email: string;
    displayName?: string;
    photoURL?: string;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default user;
