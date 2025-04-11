import mongoose from "mongoose";

const tokenBlackList = new mongoose.Schema({
    blackListedToken: {
        type: String
    },

})

const tokenBlackListModel = mongoose.model('tokenBlackList', tokenBlackList)

export default tokenBlackListModel