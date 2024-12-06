import React from 'react'
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useState } from 'react';
import { useEffect } from 'react';

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

    useEffect(()=>{
        fetchHistory()
    },[])

  return (
    <>
        <div>
            <div className='flex justify-between mb-3'>
                <h1 className='text-xl'>Todays Analysis</h1>
                <button onClick={()=>window.location.reload()} className="text-base p-2 bg-blue-700 text-white rounded float-end">Refresh</button>
            </div>
            <div className='grid grid-cols-2 mb-5 gap-2'>
                <div className='text-xl border-2 p-4 py-8'>
                    <h3 className='mb-2'><b>Total Products Sold</b></h3>
                    <span>{analyse[0]}</span>
                </div>
                <div className='text-xl border-2 p-4 py-8'>
                    <h3 className='mb-2'><b>Total Cost Price</b></h3>
                    <span>{currency}{analyse[1]}</span>
                </div>
                <div className='text-xl border-2 p-4 py-8'>
                    <h3 className='mb-2'><b>Total Amount</b></h3>
                    <span>{currency}{analyse[2]}</span>
                </div>
                <div className='text-xl border-2 p-4 py-8'>
                    <h3 className={`${analyse[3]>0?'text-green-600':'text-red-600'} mb-2`}><b>{analyse[3]>0?"Profit":"Loss"}</b></h3>
                    <span>{currency}{analyse[3]}{" "}</span>
                </div>
            </div>
        </div>
    </>
  )
}

export default Analyze