import mongoose from "mongoose";

const billingHistory = new mongoose.Schema({
    products : {
        type : Array,
        required : true
    },
    totalAmt : {
        type : Number,
        required : true
    },
    date : {
        type : String,
        required : true
    },
    time : {
        type : String,
        required : true
    }
})

const billingHistoryModel = mongoose.models.billing || mongoose.model('billing', billingHistory)

export default billingHistoryModel;