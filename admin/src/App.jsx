import { Routes, Route } from "react-router-dom";
import BillingHistory from "./pages/BillingHistory";
import ListProducts from "./pages/ListProducts";
import AddProduct from "./pages/AddProduct";
import Sidebar from "./components/Sidebar";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Analyze from "./pages/Analyze";
import EditBill from "./pages/EditBill";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

function App() {
  const currency = "₹";
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer/>
      <div className="flex w-full">
        <Sidebar />
        <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
          <Routes>
            <Route path="/" element={<BillingHistory currency={currency}/>} />
            <Route path="/listproducts" element={<ListProducts currency={currency} />} />
            <Route path="/addproduct" element={<AddProduct currency={currency} />} />
            <Route path="/analyze" element={<Analyze currency={currency} />} />
            <Route path="/editbill" element={<EditBill currency={currency}/>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
