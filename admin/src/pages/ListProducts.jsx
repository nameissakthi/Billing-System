import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify"
import fmt from "indian-number-format"
import { EditableText } from "@blueprintjs/core"

const ListProducts = ({ currency }) => {
  
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.delete(backendUrl + "/api/product/remove", { 
        headers : {
          id
        }
       } );
      
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const changeProduct = (value, key, id) => {
    setList(list=> {
      return (
        list.map(product => {
          return product._id === id ? { ...product, [key]:value } : product;
        })
      )
    })
  }

  const updateProduct = async (id) => {

    const product = list.filter(product=>product._id===id)

    try {
      const response = await axios.post(backendUrl + "/api/product/update", {
        id,
        description : product[0].description,
        cp: product[0].cp,
        sp: product[0].sp
      });
      
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=600");

    const products = list.map((item, index) => `
      <tr>
        <td style="text-align: center;">${index+1}</td>
        <td style="text-align: center;">${item.description}</td>
        <td style="text-align: center;">${item.cp}</td>
        <td style="text-align: center;">${item.sp}</td>
      </tr>
    `)
    .join("")

    printWindow.document.write(`
          <html>
            <head>
              <title>Bill</title>
              <style>
                body { font-family: Arial, sans-serif; }
                table { border-collapse: collapse; width: 100%;}
                td { border:2px solid black; padding : 5px }
                span{ margin: 2px 0px; }
              </style>
            </head>
            <body>
              <h1>Products</h1>
              <table style="font-size: 10px;">
                <thead>
                  <tr style="text-align: center; font-size: 12px;">\
                    <td><b>S. No.</b></td>
                    <td><b>Product Description</b></td>
                    <td><b>Cost Price</b></td>
                    <td><b>Selling Price</b></td>
                  </tr>
                </thead>
                <tbody>
                  ${products}
                </tbody>
              </table>
            </body>
          </html>
        `);
    
        printWindow.document.close();
        printWindow.print();
  }

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <div className="flex gap-2 justify-between items-center mb-3">
        <p className="mb-2 text-2xl">All Products List</p>
        <button onClick={handlePrint} className="text-base py-2 px-4 bg-violet-700 text-white rounded">Print</button>
      </div>
      <div className="flex flex-col gap-2">
        <div className="hidden md:grid grid-cols-[3fr_1fr_1fr_1fr] items-center px-2 py-1 border bg-gray-100 text-sm">
          <b>DESCRIPTION</b>
          <b>COST PRICE({currency})</b>
          <b>SELLING PRICE({currency})</b>
          <b className="text-center">ACTION</b>
        </div>
        {list.map((product, index) => (
          <div
            className="grid grid-cols-[3fr_1fr_1fr] md:grid-cols-[3fr_1fr_1fr_1fr] items-center gap-2 py-3 px-2 border text-sm"
            key={index}
          >
              <input className="border-2 border-slate-800 p-2" type="text" value={product.description} onChange={e=>changeProduct(e.target.value, 'description', product._id)} />
            <p>
              <input className="border-2 border-slate-800 p-2 w-fit" type="number" value={product.cp} onChange={e=>changeProduct(e.target.value, 'cp', product._id)} />
            </p>  
            <p>
              <input className="border-2 border-slate-800 p-2 w-fit" type="number" value={product.sp} onChange={e=>changeProduct(e.target.value, 'sp', product._id)} />
            </p>
            <div className="flex justify-evenly">
              <p
                className="text-center cursor-pointer border-2 rounded w-fit p-2 bg-green-500 text-white"
                onClick={() => updateProduct(product._id)}
              >
                change
              </p>
              <p
                className="text-center cursor-pointer border-2 rounded w-fit p-2 bg-red-500 text-white"
                onClick={() => removeProduct(product._id)}
              >
                delete
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ListProducts;
