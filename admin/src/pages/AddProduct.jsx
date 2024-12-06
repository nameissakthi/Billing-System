import React, { useState } from "react";
import { backendUrl } from "../App.jsx";
import { toast } from "react-toastify"
import axios from "axios";

const AddProduct = ({ currency }) => {
  const [description, setDescription] = useState("");
  const [cp, setCp] = useState("");
  const [sp, setSp] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        backendUrl + "/api/product/add",
        {description,cp,sp}
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setDescription("");
        setCp("");
        setSp("");
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
            <p className="mb-2 mr-3 inline">Product Cost Price</p>
            <input
              onChange={(e) => setCp(e.target.value)}
              value={cp}
              className="w-full px-3 py-2 sm:w-[120px] rounded"
              type="number"
              placeholder={`Eg.${currency}25`}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-8">
          <div>
            <p className="mb-2 mr-3 inline">Product Selling Price</p>
            <input
              onChange={(e) => setSp(e.target.value)}
              value={sp}
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
