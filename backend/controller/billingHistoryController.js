import billingHistoryModel from "../models/billingHistoryModel.js";

const addBillingHistory = async (req, res) => {
    try {
        const { products, date, time, billNum, billTo, billFrom } = req.body

        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1;
        let dd = today.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        const formattedToday = dd + '/' + mm + '/' + yyyy;

        function convertToIST(date) {
            // Create a new Date object for the IST timezone
            const istDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
            
            // Format the date to 12-hour format with AM/PM
            const options = {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };
            
            const timeIn12HourFormat = istDate.toLocaleString('en-US', options);
            
            return timeIn12HourFormat;
        }
        
        const localTime = new Date(); 

        let netAmt = products.map(value => value.quantity*value.sp)
        let sum = 0;
        netAmt.forEach(num => sum+=num) 

        let savings = 0;
        let cpSum = 0
        let savingsNetAmt = products.map(value => value.quantity*value.cp)
        savingsNetAmt.forEach(num => cpSum+=num)
        savings = sum-cpSum

        const billingHistoryData = {
            billNum,
            billTo,
            billFrom,
            products,
            totalAmt : sum,
            date : date || formattedToday,
            time : time || convertToIST(localTime),
            savings
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

const retrieveLastProduct = async (req, res) => {
    try {
        const lastProduct = await billingHistoryModel.find().sort({ _id: -1 }).limit(1);
        let newBillNumber;

        if (lastProduct.length !== 0) {
            const lastBillNumber = lastProduct[0].billNum;
            let billNumber = lastBillNumber.slice(4); 
            billNumber = Number(billNumber);
            newBillNumber = "IMSW" + (billNumber + 1); 
        } else {
            newBillNumber = "IMSW25000"; 
        }

        res.json({ success: true, billNumber: newBillNumber });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const removeHistory = async (req, res) => {
    try {
        await billingHistoryModel.findByIdAndDelete(req.headers.id)
        res.json({success : true, message : "History Removed"})
    } catch (error) {
        console.log(error)
        res.json({success : false, message : error.message})
    }
}



export { addBillingHistory, listBillingHistory, clearBillingHistory, retrieveLastProduct, removeHistory }