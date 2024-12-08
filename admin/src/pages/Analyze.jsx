import React from 'react'
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useState, useEffect, useRef } from 'react';
import commafy from "commafy"

const Analyze = ({currency}) => {

    const [history, setHistory] = useState([])

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
    }
    
    const analysis = () => {
        let analyse = [0,0,0,0];
        for(let i=0;i<history.length;i++){
            for (let index = 0; index < history[i].products.length; index++) {
                analyse[0] += history[i].products[index].quantity
                analyse[1] += history[i].products[index].cp * history[i].products[index].quantity
            }
            analyse[2] += history[i].totalAmt
            analyse[3] += history[i].savings
        }

        return analyse
    }

    let analyse = analysis()

    const handlePrint = () => {
        const printWindow = window.open("", "", "width=800,height=600");
        
        printWindow.document.write(`
            <html>
              <head>
                <title>Bill</title>
                <style>
                  body { font-family: Arial, sans-serif; }
                  section { display : grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap : 10px; }
                  div { border : 2px solid black; padding : 0.5rem 1rem; font-size: 1.25rem; line-height: 1.75rem; }
                  h3 { margin-bottom : 0.5rem; font-size : 1.4rem; }
                </style>
              </head>
              <body>
                <h1>Analysis</h1>
                <section>
                    <div>
                        <h3><b>Total Products Sold</b></h3>
                        <span>${commafy(analyse[0])}</span>
                    </div>
                    <div>
                        <h3><b>Total Cost Price</b></h3>
                        <span>${currency}${commafy(analyse[1])}</span>
                    </div>
                    <div>
                        <h3><b>Total Amount</b></h3>
                        <span>${currency}${commafy(analyse[2])}</span>
                    </div>
                    <div>
                        <h3><b>${analyse[3]>0?"Profit ↑":"Loss ↓"}</b></h3>
                        <span>${currency}${commafy(analyse[3])}</span>
                    </div>
                </section>
              </body>
            </html>
          `);

        printWindow.document.close();
        printWindow.print();
    }

    useEffect(()=>{
        fetchHistory()
    },[])

  return (
    <>
        <div>
            <div className='flex justify-between mb-3'>
                <h1 className='text-xl'>Analysis</h1>
                <div className='flex gap-2'>
                    <button onClick={()=>window.location.reload()} className="text-base p-2 bg-green-700 text-white rounded float-end">Refresh</button>
                    <button onClick={handlePrint} className="text-base p-2 bg-violet-700 text-white rounded float-end">Print</button>
                </div>
            </div>
            <div className='grid grid-cols-2 mb-5 gap-2'>
                <div className='text-xl border-2 p-4 py-8'>
                    <h3 className='mb-2'><b>Total Products Sold</b></h3>
                    <span>{commafy(analyse[0])}</span>
                </div>
                <div className='text-xl border-2 p-4 py-8'>
                    <h3 className='mb-2'><b>Total Cost Price</b></h3>
                    <span>{currency}{commafy(analyse[1])}</span>
                </div>
                <div className='text-xl border-2 p-4 py-8'>
                    <h3 className='mb-2'><b>Total Amount</b></h3>
                    <span>{currency}{commafy(analyse[2])}</span>
                </div>
                <div className='text-xl border-2 p-4 py-8'>
                    <h3 className={`${analyse[3]>0?'text-green-600':'text-red-600'} mb-2`}><b>{analyse[3]>0?"Profit":"Loss"}</b></h3>
                    <span>{currency}{commafy(analyse[3])}{" "}</span>
                </div>
            </div>
        </div>
    </>
  )
}

export default Analyze