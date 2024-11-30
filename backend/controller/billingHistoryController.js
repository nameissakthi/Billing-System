import billingHistoryModel from "../models/billingHistoryModel.js";

const addBillingHistory = async (req, res) => {
    try {
        const { products, date, time } = req.body

        let netAmt = products.map(value => value.qty*value.rate)
        let sum = 0;
        netAmt.forEach(num => sum +=num) 

        const billingHistoryData = {
            products,
            totalAmt : sum,
            date : date || new Date().toLocaleDateString(),
            time : time || new Date().toLocaleTimeString(),
        }

        const billingHistory = new billingHistoryModel(billingHistoryData)
        await billingHistory.save()
        res.json({success : true, message : "History Saved"})

    } catch (error) {
        console.log(error);
        res.json({success : false, message : error.message})
    }
}

const listBillingHistory = async (req, res) => {
    try {
        const billingHistory = await billingHistoryModel.find({})
        res.json({success : true, billingHistory})

    } catch (error) {
        console.log(error);
        res.json({success : false, message : error.message})
    }
}

const clearBillingHistory = async (req, res) => {
    try {
        await billingHistoryModel.deleteMany()
        res.json({success : true, message : "History Cleared"})
    } catch (error) {
        console.log(error);
        res.json({success : false, message : error.message})
    }
}


export { addBillingHistory, listBillingHistory, clearBillingHistory }