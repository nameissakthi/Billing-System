import React, { useState } from "react";
import { backendUrl } from "../App.jsx";
import { toast } from "react-toastify"
import axios from "axios";

const AddProduct = ({ currency }) => {
  const [description, setDescription] = useState("");
  const [mrp, setMrp] = useState("");
  const [rate, setRate] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        backendUrl + "/api/product/add",
        {description,mrp,rate}
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setDescription("");
        setMrp("");
        setRate("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2 rounded"
          type="text"
          placeholder="Write Here"
          required
        />
      </div>

      <div className="flex justify-between w-[500px]">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-8">
          <div>
            <p className="mb-2 mr-3 inline">Product MRP</p>
            <input
              onChange={(e) => setMrp(e.target.value)}
              value={mrp}
              className="w-full px-3 py-2 sm:w-[120px] rounded"
              type="number"
              placeholder={`Eg.${currency}25`}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-8">
          <div>
            <p className="mb-2 mr-3 inline">Product Rate</p>
            <input
              onChange={(e) => setRate(e.target.value)}
              value={rate}
              className="w-full px-3 py-2 sm:w-[120px] rounded"
              type="number"
              placeholder={`Eg.${currency}25`}
            />
          </div>
        </div>
      </div>

      <button
        className="w-28 py-3 mt-4 bg-black text-white rounded"
        type="submit"
      >
        ADD
      </button>
    </form>
  );
};

export default AddProduct;
