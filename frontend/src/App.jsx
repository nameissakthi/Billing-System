import { useEffect, useState } from "react";
import "./App.css";
import BillingSystem from "./Components/BillingSystem/BillingSystem";
import axios from "axios";

export const currency = "$";
export const tax = 18;
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function App() {

  const [products, setProducts] = useState([])

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    fetchAllProducts()
  },[])

  return (
    <>
      <BillingSystem  products={products} />
    </>
  );
}

export default App;
