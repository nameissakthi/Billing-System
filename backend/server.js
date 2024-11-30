import express from "express"
import cors from "cors"
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import productRouter from "./routes/productRoute.js"
import billingHistoryRouter from "./routes/billingHistoryRoute.js"

const app = express()

const port = process.env.PORT || 4000
connectDB()
app.use(express.json())
app.use(cors())

app.use('/api/product', productRouter)
app.use('/api/billinghistory', billingHistoryRouter)


app.get("/", (req,res) => {
    res.send("API WORKING")
})

app.listen(port, () => {
    console.log("Server Running on ",port)
})