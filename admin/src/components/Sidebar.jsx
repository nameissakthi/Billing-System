import React from 'react'
import { NavLink } from 'react-router-dom'
import logo from "../assets/logo.png"

const Sidebar = () => {
  return (
    <div className='w-[20%] min-h-screen border-r-2'>
        <div className='flex justify-center mt-2'>
            {/* <img src={logo} alt="logo" className='w-48' /> */}
            <div className='border border-black m-2'>
                <h1 className='text-center text-2xl'><b>Image StampWorks</b></h1>
                <p className='my-2 mx-1'>No:1, Dr Rajendra Prasad Rd{"("}100feet RD{")"}, Near GP Signal, Gandhipuram, Coimbatore - 641012</p>
                <p className='flex flex-col m-1'>
                    <span>PH : 0422 438 7600</span>{" "}
                    <span>Whatsapp : 9894052888</span>
                </p>
            </div>
        </div>
        <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
            <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l" to="/" >
                <p className='md:block'>Billing History</p>
            </NavLink>
            <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l" to="/analyze" >
                <p className='md:block'>Analyze</p>
            </NavLink>
            <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l" to="/addproduct" >
                <p className='md:block'>Add Product</p>
            </NavLink>
            <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l" to="/listproducts" >
                <p className='md:block'>Products List</p>
            </NavLink>
        </div>
    </div>
  )
}

export default Sidebar