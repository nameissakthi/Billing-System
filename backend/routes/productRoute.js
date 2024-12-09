import express from "express"
import { addProduct, listProducts, removeProduct, updateProduct } from "../controller/productController.js"

const productRouter = express.Router()

productRouter.post("/add", addProduct)
productRouter.delete("/remove", removeProduct)
productRouter.get("/list", listProducts)
productRouter.post("/update", updateProduct)

export default productRouter