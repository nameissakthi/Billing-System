import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify"

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
      console.log(id);
      
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

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2">All Products List</p>
      <div className="flex flex-col gap-2">
        <div className="hidden md:grid grid-cols-[3fr_1fr_1fr_1fr] items-center px-2 py-1 border bg-gray-100 text-sm">
          <b>DESCRIPTION</b>
          <b>COST PRICE</b>
          <b>SELLING PRICE</b>
          <b className="text-center">ACTION</b>
        </div>

        {list.map((product, index) => (
          <div
            className="grid grid-cols-[3fr_1fr_1fr] md:grid-cols-[3fr_1fr_1fr_1fr] items-center gap-2 py-3 px-2 border text-sm"
            key={index}
          >
            <p>{product.description}</p>
            <p>
              {currency}
              {product.cp}
            </p>
            <p>
              {currency}
              {product.sp}
            </p>
            <p
              className="text-center cursor-pointer text-lg"
              onClick={() => removeProduct(product._id)}
            >
              X
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default ListProducts;
