import mongoose from "mongoose";

const billingHistory = new mongoose.Schema({
    billNum : {
        type: String,
        required : true
    },
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
    },
    savings : {
        type : Number,
        required : true
    }
})

const billingHistoryModel = mongoose.models.billing || mongoose.model('billing', billingHistory)

export default billingHistoryModel;