import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import fmt from "indian-number-format"
import numberToWord from "npm-number-to-word"

const BillingHistory = ({currency}) => {
  const [history, setHistory] = useState([]);
  const [date, setDate] = useState("")

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

  const clearHistory = async () => {
    try {
      const response = await axios.delete(backendUrl + "/api/billinghistory/clearhistory");
      if(response.data.success){
        toast.success(response.data.message);
      }
      else{
        toast.error(response.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };



  const handlePrint = async () => {
    const printWindow = window.open("", "", "width=800,height=600");

    const filterHistory = history.filter(record => record.date === date)

    let totalAmtHist = 0
    filterHistory.map(record=>totalAmtHist+=record.totalAmt)

    let totalProfit = 0
    filterHistory.map(record=>totalProfit+=record.savings)

    const hist = filterHistory.map((record, index) => `
      <tr>
        <td style="text-align: center;">${index+1}</td>
        <td style="text-align: center;">${record.billNum}</td>
        <td style="text-align: center;">${record.billFrom}</td>
        <td style="text-align: center;">${record.billTo}</td>
        <td style="width: 60px;">
          <p style="display:flex; flex-direction:column;">
            <span>${record.date}</span>
            <span>${record.time}</span>
          </p>
        </td>
        <td>
          <p style="display: flex; flex-direction: column;">
            ${record.products.map((item) => {
              return (`
                <span>
                  ${item.description} x ${item.quantity}${" "}
                  <span>[CP - ${fmt.format(item.cp)}]</span>
                  <span>[SP-${fmt.format(item.sp)}]</span> 
                </span>`
              );
            }).join("")}
          </p>
        </td>
        <td style="text-align: center;">${currency}${fmt.format(record.totalAmt)}</td>
        <td style="text-align: center;">${currency}${fmt.format(record.savings)}</td>
      </tr>
      `)
      .join("")

    printWindow.document.write(`
      <html>
        <head>
          <title>Bill</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { border-collapse: collapse; }
            td { border:2px solid black; padding : 5px }
            span{ margin: 2px 0px; }
          </style>
        </head>
        <body>
          <h1>History</h1>
          <p style="font-size: 1.5rem;">Sales On ${date}</p>
          <table style="font-size: 10px;">
            <thead>
              <tr style="text-align: center; font-size: 12px;">\
                <td><b>S. No.</b></td>
                <td><b>Bill Number</b></td>
                <td><b>Bill From</b></td>
                <td><b>Bill To</b></td>
                <td><b>Date & Time</b></td>
                <td><b>Products</b></td>
                <td><b>Total Amount</b></td>
                <td><b>Profit</b></td>
              </tr>
            </thead>
            <tbody>
              ${hist}
            </tbody>
            <tfoot>
              <tr>
                <td><b>Total</b></td><td colspan="6" style="text-align: right;"><b>${numberToWord(totalAmtHist).charAt(0).toUpperCase()+numberToWord(totalAmtHist).slice(1)} rupees only</b></td><td><b>${currency}${fmt.format(totalAmtHist)}</b></td>
              </tr>
              <tr>
                <td><b>Profit</b></td><td colspan="6" style="text-align: right;"><b>${numberToWord(totalProfit).charAt(0).toUpperCase()+numberToWord(totalProfit).slice(1)} rupees only</b></td><td><b>${currency}${fmt.format(totalProfit)}</b></td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  useEffect(()=>{
    fetchHistory();
  }, [])

  return (
    <div>
      <p className="text-xl flex justify-between">
        <span>Billing History</span>
        <div className="flex gap-2">
          <input type="text" placeholder="dd/mm/yyyy" maxLength={10} value={date} onChange={e=>setDate(`${e.target.value}`)} className="px-3 w-36 border-2 border-black rounded-lg" />
          {
            date!=""?<button onClick={handlePrint} className="text-base p-2 bg-violet-700 text-white rounded">Print</button>
            :""
          }
        </div>
      </p>
      <hr className="mt-4 mb-8 border-black" />
      <div className="flex flex-col">
        {history.map((record, index) => {
          return (
            <div
              className="mb-4 p-2 rounded border-[1px] border-slate-600"
              key={index}
            >
              <p className="mb-2 p-1 border-b-2 border-slate-400 flex justify-between">
                <span className="flex flex-col">
                  <span className="mr-2 text-slate-800"><b>Bill Number :</b> {record.billNum}</span>
                  <span className="text-slate-800"><b>Bill From :</b> {record.billFrom}</span>
                  <span className="text-slate-800"><b>Bill To :</b> {record.billTo}</span>
                </span>
                <span className="flex flex-col">
                  <span className="mr-2 text-slate-800"><b>Date :</b> {record.date}</span>
                  <span className="text-slate-800"><b>Time :</b> {record.time}</span>
                </span>
              </p>
              {record.products.map((item, index) => {
                if (index === record.products.length - 1) {
                  return (
                    <span className="py-0.5" key={index}>
                      {item.description} x {item.quantity}{" "}
                    </span>
                  );
                } else {
                  return (
                    <span className="py-0.5" key={index}>
                      {item.description} {"   "} x {item.quantity},{" "}
                    </span>
                  );
                }
              })}
              <div className="flex justify-between mt-2">
                <span className="text-slate-950"><b>Total Amount : {currency}{fmt.format(record.totalAmt)}</b></span>
                <span className="text-slate-950"><b>Profit : {currency}{fmt.format(record.savings)}</b></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BillingHistory;
