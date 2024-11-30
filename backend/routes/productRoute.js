import express from "express"
import { addProduct, listProducts, removeProduct } from "../controller/productController.js"

const productRouter = express.Router()

productRouter.post("/add", addProduct)
productRouter.delete("/remove", removeProduct)
productRouter.get("/list", listProducts)

export default productRouter