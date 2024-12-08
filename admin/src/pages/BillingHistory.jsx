import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import commafy from "commafy"

const BillingHistory = ({currency}) => {
  const [history, setHistory] = useState([]);

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

    const hist = history.map((record, index) => `
      <tr>
        <td style="text-align: center;">${index+1}</td>
        <td style="text-align: center;">${record.billNum}</td>
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
                  <span>[CP - ${commafy(item.cp)}]</span>
                  <span>[SP-${commafy(item.sp)}]</span> 
                </span>`
              );
            }).join("")}
          </p>
        </td>
        <td style="text-align: center;">${currency}${commafy(record.totalAmt)}</td>
        <td style="text-align: center;">${currency}${commafy(record.savings)}</td>
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
          <table style="font-size: 10px;">
            <thead>
              <tr style="text-align: center; font-size: 12px;">\
                <td><b>S. No.</b></td>
                <td><b>Bill Number</b></td>
                <td><b>Bill To</b></td>
                <td><b>Date & Time</b></td>
                <td><b>Products</b></td>
                <td><b>Total Amount</b></td>
                <td><b>Savings</b></td>
              </tr>
            </thead>
            <tbody>
              ${hist}
            </tbody>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  useEffect(() => {
    fetchHistory();
  }, [clearHistory]);

  return (
    <div>
      <p className="text-xl flex justify-between">
        <span>Billing History</span>
        <div className="flex gap-2">
          <button onClick={clearHistory} className="text-base p-2 bg-red-700 text-white rounded">Clear History</button>
          <button onClick={handlePrint} className="text-base p-2 bg-violet-700 text-white rounded">Print</button>
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
                  <span className="text-slate-800"><b>Bill To :</b> {record.billTo}</span>
                </span>
                <span className="flex flex-col">
                  <span className="mr-2 text-slate-800"><b>Date :</b> {record.date}</span>
                  <span><b className="text-slate-800">Time :</b> {record.time}</span>
                </span>
              </p>
              {record.products.map((item, index) => {
                if (index === record.products.length - 1) {
                  return (
                    <span className="py-0.5" key={index}>
                      {item.description} x {item.quantity}{" "}
                      <span>[CP - {commafy(item.cp)}]</span>
                      <span>[SP-{commafy(item.sp)}]</span> 
                    </span>
                  );
                } else {
                  return (
                    <span className="py-0.5" key={index}>
                      {item.description} {"   "} x {item.quantity}{" "}
                      <span>[CP - {commafy(item.cp)}]</span>
                      <span>[SP - {commafy(item.sp)}]</span>,{" "}
                    </span>
                  );
                }
              })}
              <div className="flex justify-between mt-2">
                <span className="text-slate-950"><b>Total Amount : {currency}{commafy(record.totalAmt)}</b></span>
                <span className="text-slate-950"><b>Savings : {currency}{commafy(record.savings)}</b></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BillingHistory;
