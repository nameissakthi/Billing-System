import express from "express"
import { addProduct, listProducts, removeProduct } from "../controller/productController.js"

const productRouter = express.Router()

productRouter.post("/add", addProduct)
productRouter.get("/remove", removeProduct)
productRouter.get("/list", listProducts)

export default productRouter