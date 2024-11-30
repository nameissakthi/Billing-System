import productModel from "../models/productModel.js"

const addProduct = async (req, res) => {
    try {
        const { description, mrp, rate } = req.body
        
        const productData = {
            description,
            mrp: Number(mrp),
            rate: Number(rate)
        }
        const product = new productModel(productData)
        await product.save()

        res.json({success : true, message : "Product Added"})

    } catch (error) {
        console.log(error)
        res.json({success : false, message : error.message})
    }
}

const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success : true, message : "Product Removed"})
    } catch (error) {
        console.log(error)
        res.json({success : false, message : error.message})
    }
}

//List Products
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({})
        res.json({success : true, products})
    } catch (error) {
        console.log(error)
        res.json({success : false, message : error.message})
    }
}

export {addProduct, removeProduct, listProducts}