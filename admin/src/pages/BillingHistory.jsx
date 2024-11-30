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

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div>
      <p className="mb-2">Billing History</p>
      <div className="flex flex-col">
        {history.map((record, index) => {
          return (
            <div
              className="mb-4 p-2 rounded border-[1px] border-slate-600"
              key={index}
            >
              {record.products.map((item, index) => {
                if (index === record.products.length - 1) {
                  return (
                    <span className="py-0.5" key={index}>
                      {item.description} x {item.qty}{" "}
                      <span>[Rate-{item.rate}]</span>
                    </span>
                  );
                } else {
                  return (
                    <span className="py-0.5" key={index}>
                      {item.description} x {item.qty}{" "}
                      <span>[Rate-{item.rate}]</span>,{" "}
                    </span>
                  );
                }
              })}
              <div className="flex justify-between">
                <span className="text-slate-950"><b>Total Amount : {record.totalAmt}</b></span>
                <p>
                  <span className="mr-2 text-slate-800"><b>Date : {record.date}</b></span>
                  <span><b className="text-slate-800">Time : {record.time}</b></span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BillingHistory;
