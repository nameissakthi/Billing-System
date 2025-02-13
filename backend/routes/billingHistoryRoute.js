import express from "express"
import { addBillingHistory, listBillingHistory, clearBillingHistory, retrieveLastProduct, removeHistory, editBillHistory } from "../controller/billingHistoryController.js"

const billingHistoryRouter = express.Router()

billingHistoryRouter.post("/add", addBillingHistory)
billingHistoryRouter.get("/list", listBillingHistory)
billingHistoryRouter.get("/lasthist", retrieveLastProduct)
billingHistoryRouter.delete('/removehistory', removeHistory)
billingHistoryRouter.post('/update', editBillHistory)

billingHistoryRouter.delete("/clearhistory", clearBillingHistory)

export default billingHistoryRouter