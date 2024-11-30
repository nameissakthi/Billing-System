import express from "express"
import { addBillingHistory, listBillingHistory, clearBillingHistory } from "../controller/billingHistoryController.js"

const billingHistoryRouter = express.Router()

billingHistoryRouter.post("/add", addBillingHistory)
billingHistoryRouter.get("/list", listBillingHistory)

billingHistoryRouter.delete("/clearhistory", clearBillingHistory)

export default billingHistoryRouter