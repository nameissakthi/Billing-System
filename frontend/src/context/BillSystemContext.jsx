import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const BillSystemContext = createContext()

const BillSystemContextProvider = (props) => {

    const currency = '₹'
    const tax = 18
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [products, setProducts] = useState([])


    const getProductData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list')
            if(response.data.success){
                setProducts(response.data.products)
            }else{
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    useEffect(() => {
        getProductData()
    }, [])

    const value = {
        currency, 
        tax,
        products
    }

    return (
        <BillSystemContext.Provider value={value}>
            {props.childern}
        </BillSystemContext.Provider>
    )
}

export default BillSystemContextProvider