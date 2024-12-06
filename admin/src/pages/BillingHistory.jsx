import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const BillingHistory = () => {
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

  useEffect(() => {
    fetchHistory();
  }, [clearHistory]);

  return (
    <div>
      <p className="text-xl flex justify-between">
        <span>Billing History</span>
        <button onClick={clearHistory} className="text-base p-2 bg-red-700 text-white rounded">Clear History</button>
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
                Bill Number : {record.billNum}
                <span>
                  <span className="mr-2 text-slate-800"><b>Date : {record.date}</b></span>
                  <span><b className="text-slate-800">Time : {record.time}</b></span>
                </span>
              </p>
              {record.products.map((item, index) => {
                if (index === record.products.length - 1) {
                  return (
                    <span className="py-0.5" key={index}>
                      {item.description} x {item.quantity}{" "}
                      <span>[CP - {item.cp}]</span>
                      <span>[SP-{item.sp}]</span> 
                    </span>
                  );
                } else {
                  return (
                    <span className="py-0.5" key={index}>
                      {item.description} {"   "} x {item.quantity}{" "}
                      <span>[CP - {item.cp}]</span>
                      <span>[SP - {item.sp}]</span>,{" "}
                    </span>
                  );
                }
              })}
              <div className="flex justify-between mt-2">
                <span className="text-slate-950"><b>Total Amount : {record.totalAmt}</b></span>
                <span className="text-slate-950"><b>Savings : {record.savings}</b></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BillingHistory;
