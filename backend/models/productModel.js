import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    description : {
        type : String,
        required : true
    },
    mrp : {
        type : Number,
        required : true
    },
    rate : {
        type : Number,
        required : true
    }
})

const productModel = mongoose.models.product || mongoose.model('product', productSchema)

export default productModel;