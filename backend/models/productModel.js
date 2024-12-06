import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    description : {
        type : String,
        required : true
    },
    cp : {
        type : Number,
        required : true
    },
    sp : {
        type : Number,
        required : true
    }
})

const productModel = mongoose.models.product || mongoose.model('product', productSchema)

export default productModel;