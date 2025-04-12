import mongoose from "mongoose";
declare const tokenBlackListModel: mongoose.Model<{
    blackListedToken?: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    blackListedToken?: string;
}> & {
    blackListedToken?: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    blackListedToken?: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    blackListedToken?: string;
}>> & mongoose.FlatRecord<{
    blackListedToken?: string;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default tokenBlackListModel;
