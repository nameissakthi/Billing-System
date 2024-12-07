import React from 'react'
import { NavLink } from 'react-router-dom'
import logo from "../assets/logo.png"

const Sidebar = () => {
  return (
    <div className='w-[18%] min-h-screen border-r-2'>
        <div className='flex justify-center mt-2'>
            <img src={logo} alt="logo" className='w-48' />
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