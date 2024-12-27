import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify"
import axios from 'axios'
import { backendUrl } from "../App";
import logo from "../assets/logo.png"
import fmt from "indian-number-format"
import numberToWord from "npm-number-to-word"

const EditBill = ({currency}) => {

    const [billNum, setBillNum] = useState("")
    const [history, setHistory] = useState([]);
    const [bill, setBill] = useState(false)

    const updateHistory = async () => {
        try {
            const response = await axios.post(backendUrl+"/api/billinghistory/update", {bill})
            if(response.data.success){
                console.log(response.data.message)
            }else{
                console.error(response.data.message)
            }
        } catch (error) {
           console.log(error);
          toast.error(error.message); 
        }
      }

      const fetchHistory = async () => {
          try {
            const response = await axios.get(backendUrl + "/api/billinghistory/list");
            if (response.data.success) {
              setHistory(response.data.billingHistory.reverse());
            } else {
              toast.error(response.data.message);
            }
          } catch (error) {
            console.log(error);
            toast.error(error.message);
          }
        };

    const onSearchHandler = () => {
        if(billNum!=""){
            const editBill = history.filter((hist)=>hist.billNum===billNum.trim())
            if(editBill){
                setBill(editBill[0])
            }else{
                toast.warning("Bill Is not Loaded", { hideProgressBar: true, autoClose: 2000 })
            }
        }else{
            toast.warning("Enter the Bill Number", { hideProgressBar: true, autoClose: 2000 })
        }
    }

    const changeBill = (value, key) => {
        setBill(prevBill=>{
            return { ...prevBill, [key]:value }
        })
      }

      const handleQuantityChange = (id, newQuantity) => {
        const updatedProducts = bill.products.map((product) =>
          product._id === id ? { ...product, quantity: newQuantity } : product
        );
    
        const updatedTotalAmt = updatedProducts.reduce(
          (total, product) => total + product.sp * product.quantity,
          0
        );
    
        const updatedSavings = updatedProducts.reduce(
          (savings, product) =>
            savings + (product.sp - product.cp) * product.quantity,
          0
        );
    
        setBill({
          ...bill,
          products: updatedProducts,
          totalAmt: updatedTotalAmt,
          savings: updatedSavings,
        });
      };

      const handlePrint = async () => {
          const printWindow = window.open("", "", "width=800,height=600");
        
          const products = bill.products
            .map(
              (item, index) => `<tr>
                            <td style="text-align:center;">${index+1}</td>
                            <td>${item.description}</td>
                            <td style="text-align:center;">${item.quantity}</td>
                            <td style="text-align:center;">${currency}${fmt.format(item.sp)}</td>
                            <td style="text-align:center;">${currency}${fmt.format(item.sp * item.quantity)}</td>
                          </tr>`
            )
            .join("");
        
          const billDetails = (`
            <html>
              <head>
                <title>Bill</title>
                <style>
                  @media print {
                  @page {
                    size: A5;
                    margin: 0;
                  }
                  body { 
                    margin: 0;
                    padding: 0;
                    width: 14.8cm;
                    height: 21cm;
                    display: block;
                    box-sizing: border-box;
                    border: 2px solid black;
                    padding: 20px;
                  }
                  #bill-content {
                    width: 100%;
                    height: 100%;
                    padding: 10px; /* Add padding for layout adjustment */
                    box-sizing: border-box;
                  }
                  table { width: 100%; border-collapse: collapse; font-size: 12px; height:80%;}
                  th, td { border: 1px solid black; padding: 8px; text-align: left; vertical-align: top; }
                  th { background-color: #f2f2f2; }
                  h2 { margin: 0px; text-align: center; }
                  img { width: 200px; display: block; margin: 10px auto; }
                </style>
              </head>
              <body>
                   <div>
                    <div style="border: 1px solid black; border-radius: 10;">
                    <center>
                      <img src=${logo} alt="logo" id="printableImage" style="width: 35%; margin:0px; display: block;" />
                      <p style="margin: 0px;">No:913-925, Ground floor, 100feet road, Gandhipuram, Coimbatore - 641012</p>
                      <p style="display: flex; justify-content: space-evenly; margin: 10px 10px;" }}>
                        <span>PH : 0422 438 7600</span>
                        <span>Whatsapp : 9894166500</span>
                      </p>
                    </center>
                  </div>
                <table>
                  <thead>
                    <tr>
                      <td colspan="5"><h2>Cash Bill</h2></td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        <p style="display:flex; gap: 10px; flex-direction: column;">
                          <span><b>Bill Number</b>: ${bill.billNum}</span>
                          <span><b>Bill To</b>: ${bill.billTo}</span>
                        </p>
                      </td>
                      <td colspan="3">
                        <p style="display:flex; gap: 10px; flex-direction: column;">
                          <span><b>Date</b>: ${bill.date}</span>
                          <span><b>Time</b>: ${bill.time}</span>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <th style="text-align:center;">S. No.</th>
                      <th style="text-align:center;">Product</th>
                      <th style="text-align:center;">Quantity</th>
                      <th style="text-align:center;">Price</th>
                      <th style="text-align:center;">Total</th>
                    </tr>
                  </thead>
                  <div style="display:flex; flex-direction:column; justify-content:space-between;">
                  <tbody>
                    ${products}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td><b>Total</b></td><td style="text-align:center;"><b>${currency}${fmt.format(bill.totalAmt)}</b></td><td style="text-align:center;" colspan="3"><b>${numberToWord(bill.totalAmt).charAt(0).toUpperCase()+numberToWord(bill.totalAmt).slice(1)} rupees only</b></td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding-top:30px; text-align:center;">Customer's Signature</td><td style="padding-top:30px; padding-left: 60px; padding-right:60px; text-align:center;" colspan="3">Authorized Signatory</td>
                    </tr>
                  </tfoot>
                  </div>
                </table>
                   </div>
              </body>
            </html>
          `);
      
          printWindow.document.open();
          printWindow.document.write(billDetails);
          const printableImage = printWindow.document.getElementById("printableImage");
          printWindow.document.close();

          printWindow.onbeforeprint = () => {
            console.log("Print action about to start.");
          };

          printableImage.onload = () => {
            console.log("Image Logo Loaded")
            printWindow.print();
            printWindow.close();
          }
        
        };

    useEffect(()=>{
        fetchHistory();
    }, [])

  return (
    <div>
        <div className='mb-4'>
            <h1 className='text-xl'>Edit Bill</h1>
        </div>
        <div className='flex'>
            <input type="text" value={billNum} onChange={(e)=>setBillNum(e.target.value)} placeholder='Enter the Bill Number' className='p-2 bg-slate-200 rounded-l-lg w-full mr-0 outline-none' required autoFocus />
            <button className='py-2 px-8 rounded-r-lg ml-0 bg-blue-500 text-white active:scale-95' onClick={onSearchHandler}>Search</button>
        </div>
        {
            bill && <div className='mt-4'>
            <div className='flex justify-between mb-3'>
                <label htmlFor="">Bill From : 
                    <input type="text" value={bill.billFrom} className="border-2 border-slate-800 py-1 px-2 ml-2" onChange={(e)=>changeBill(e.target.value, "billFrom")} />
                </label>
                <label htmlFor="">Bill To : 
                    <input type="text" value={bill.billTo} className="border-2 border-slate-800 py-1 px-2 ml-2" onChange={(e)=>changeBill(e.target.value, "billTo")} />
                </label>
            </div>
            <div className='mb-4'>
                <h1 className='text-xl mb-2 border-b-2 border-black'>Products</h1>
                {
                    bill.products.map((item, index)=>{
                        return (
                            <div key={index} className='flex mb-2'>
                                <p>{item.description}</p>
                                <input type="number" value={item.quantity} className="border-2 border-slate-800 w-10 text-center p-1 ml-2" onChange={(e)=>handleQuantityChange(item._id, parseInt(e.target.value) || 1)} />
                            </div>
                        )
                    })
                }
            </div>
            <label htmlFor="">Total Amount
                <input type="number" className="border-2 border-slate-800 py-1 px-2 ml-2 mt-5" readOnly value={bill.totalAmt} />
            </label>
            <div className='mt-5 flex justify-between'>
                <button className='py-2 px-6 bg-green-500 rounded-lg text-white' onClick={updateHistory}>Save in History</button>
                <button className='py-2 px-6 bg-blue-500 rounded-lg text-white' onClick={handlePrint}>Print</button>
            </div>
        </div>
        }
    </div>
  )
}

export default EditBill