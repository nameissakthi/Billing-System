import React, { useState, useRef, useEffect } from "react";
import "./BillingSystem.css";
import { currency } from "../../App";
import axios from "axios";
import { backendUrl } from "../../App";
import { IoTrashBinOutline  } from "react-icons/io5"
import logo from "../../assets/logo.png"
import fmt from "indian-number-format"
import numberToWord from "npm-number-to-word"

const BillingSystem = ({products}) => {

  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [billNumber,setBillNumber] = useState("");
  const [billFrom, setBillFrom] = useState("");
  const [name, setName] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1); 
  const [suggestions, setSuggestions] = useState([]); 
  const [formattedDate, setFormattedDate] = useState("")

  const searchInputRef = useRef(null);
  const nameInputRef = useRef(null);

  const addHistory = async () => {
    if(billNumber){
      try {
        const response = await axios.post(backendUrl + '/api/billinghistory/add', {
          billTo : name,
          products : cart,
          billNum : billNumber,
          billFrom
        })
        console.log("history saved successfully")
        setName("")
        setBillFrom("")
        setCart([])
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleAddToCart = () => {
    if (!selectedProduct || quantity <= 0) return;

    const existingItem = cart.find((item) => item._id === selectedProduct._id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item._id === selectedProduct._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { ...selectedProduct, quantity }]);
    }
    setSelectedProduct(null);
    setQuantity(1);
    setSearch("");
    searchInputRef.current.focus();
  };

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
    searchInputRef.current.focus();
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.sp * item.quantity, 0);
  };

  const generateBillNumber = async (setBillNumber) => {
    try {
      const response = await axios.get(backendUrl+'/api/billinghistory/lasthist');
      
      if (response.data.success) {
          const newBillNumber = response.data.billNumber;
          setBillNumber(newBillNumber);
          setBillNumber(newBillNumber);
          console.log('Generated Bill Number:', newBillNumber);
      } else {
          console.log('Error fetching bill number');
      }
    } catch (error) {
      console.error('Error generating bill number:', error);
    }
  };

  const handleGenerateBillNumber = async () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    
    const formattedToday = dd + '/' + mm + '/' + yyyy;
    setFormattedDate(formattedToday)
    await generateBillNumber(setBillNumber)
  };
  
  const handlePrint = async (today) => {
    const printWindow = window.open("", "", "width=800,height=600");
  
    const cartItems = cart
      .map(
        (item, index) => `<tr>
                      <td style="text-align:center;">${index+1}</td>
                      <td>${item.description}</td>
                      <td style="text-align:center;">${item.quantity}</td>
                      <td style="text-align:center;">${currency}${fmt.format(item.sp)}</td>
                      <td style="text-align:center;">${currency}${fmt.format(item.sp * item.quantity)}</td>
                    </tr>`
      )
      .join("");
    const total = calculateTotal().toFixed(2);
  
    const billDetails = (`
      <html>
        <head>
          <title>Bill</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 2px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h2 { margin: 0px; text-align: center; }
            img { width: 200px; display: block; margin: 10px auto; }
          </style>
        </head>
        <body>
             <div style="border: 2px solid black; border-radius: 10;">
              <center>
                <img src=${logo} alt="logo" id="printableImage" style="width: 35%; margin:0px; display: block;" />
                <p style="margin: 0px;">No:913-925, Ground floor, 100feet road, Gandhipuram, Coimbatore - 641012</p>
                <p style="display: flex; justify-content: space-evenly; margin: 10px 10px;" }}>
                  <span>PH : 0422 438 7600</span>
                  <span>Whatsapp : 9894166500</span>
                </p>
              </center>
            </div>
          <table>
            <thead>
              <tr>
                <td colspan="5"><h2>Cash Bill</h2></td>
              </tr>
              <tr>
                <td colspan="2">
                  <p style="display:flex; gap: 10px; flex-direction: column;">
                    <span><b>Bill Number</b>: ${billNumber}</span>
                    <span><b>Bill To</b>: ${name}</span>
                  </p>
                </td>
                <td colspan="3">
                  <p style="display:flex; gap: 10px; flex-direction: column;">
                    <span><b>Date</b>: ${today}</span>
                    <span><b>Time</b>: ${new Date().toLocaleTimeString()}</span>
                  </p>
                </td>
              </tr>
              <tr>
                <th style="text-align:center;">S. No.</th>
                <th style="text-align:center;">Product</th>
                <th style="text-align:center;">Quantity</th>
                <th style="text-align:center;">Price</th>
                <th style="text-align:center;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${cartItems}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="1"><b>Total</b></td><td colspan="1" style="text-align:center;"><b>${currency}${fmt.format(total)}</b></td><td colspan="3" style="text-align:center;"><b>${numberToWord(total).charAt(0).toUpperCase()+numberToWord(total).slice(1)} rupees only</b></td>
              </tr>
              <tr>
                <td colspan="2" style="padding-top:30px; text-align:center;">Customer's Signature</td><td colspan="3" style="padding-top:30px; text-align:center;">Authorized Signatory</td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `);

    printWindow.document.open();
    printWindow.document.write(billDetails);
    const printableImage = printWindow.document.getElementById("printableImage");
    printWindow.document.close();
  
  

    printWindow.onbeforeprint = () => {
      console.log("Print action about to start.");
    };

    printableImage.onload = () => {
      console.log("Image Logo Loaded")
      printWindow.print();
      printWindow.close();
    }
  
    printWindow.onafterprint = async () => {
      console.log("Print action finished.");
      try {
        await addHistory();
      } catch (error) {
        console.error("Error saving history:", error);
      }
    };
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
    setActiveIndex(-1); // Reset active index when typing

    if (query.trim() === "") {
      setSuggestions([]);
    } else {
      const filteredProducts = products.filter((product) =>
        product.description.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredProducts.slice(0, 4)); // Limit suggestions to 4
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && selectedProduct) {
      e.preventDefault();
      handleAddToCart();
      setSelectedProduct(null);
      setSearch(""); 
      return; 
    }

    if(e.key === "Enter" && !selectedProduct){
      searchInputRef.current.focus();
    }

    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prevIndex) => (prevIndex + 1) % suggestions.length); // Cycle through suggestions
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prevIndex) =>
        prevIndex === -1 ? suggestions.length - 1 : (prevIndex - 1 + suggestions.length) % suggestions.length
      ); // Cycle backward
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      const selected = suggestions[activeIndex];
      setSelectedProduct(selected);
      setSearch(selected.description);
      setSuggestions([]); // Clear suggestions after selection
      setActiveIndex(-1); // Reset active index
    }
  };

  const onPressEnter = (e) => {
    if(billFrom){
      if(e.key==="Enter"){
        nameInputRef.current.focus()
      }
    }
  }

  useEffect(() => {
    if (billNumber && formattedDate) {
      setTimeout(() => handlePrint(formattedDate, billNumber), 0);
    }
}, [billNumber]);

  return (
    <div className="billing-system">
      <header>
        {/* <img src={logo} alt="Logo" className="logo" /> */}
        <div style={{border: "2px solid black", width:"35%",padding: "5", borderRadius: 10, display: "flex", flexDirection: "column", alignItems:"center"}}>
          <img src={logo} alt="logo" style={{ borderRadius: 10, width: "60%"}} />
          <p style={{marginBottom: 5, marginTop: 2}}>No:913-925, Ground floor, 100feet Road, Gandhipuram, Coimbatore - 641012</p>
          <p style={{display: "flex", justifyContent: "space-between", alignSelf: "stretch", marginTop: 0, marginBottom: 2, marginLeft: 10, marginRight: 10}}>
            <span>PH : 0422 438 7600</span>{" "}
            <span>Whatsapp : 9894166500</span>
          </p>
        </div>
      </header>

      <div className="main-container">
        <div className="name">
          <input type="text" name="name" onKeyDown={(e)=>onPressEnter(e)} placeholder="Bill From" value={billFrom} onChange={e=>setBillFrom(e.target.value)} autoFocus required />
          <input type="text" name="name" onKeyDown={(e)=>handleKeyDown(e)} placeholder="Customer Name" value={name} onChange={e=>setName(e.target.value)} required ref={nameInputRef} />
        </div>
        <div className="centered">
          <div className="search-section">
            <input
            ref={searchInputRef}
          type="text"
          placeholder="Search product"
          value={search}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown} // Handle key navigation
          className="search-input"
        />
             {search.length > 0 && suggestions.length > 0 && selectedProduct==null && (
          <ul className="suggestion-list">
            {suggestions.map((product, index) => (
              <li
                key={product._id}
                onClick={() => {
                  setSelectedProduct(product);
                  setSearch(product.description);
                  setSuggestions([]);
                  setActiveIndex(-1);
                }}
                className={`suggestion-item ${
                  index === activeIndex ? "active" : ""
                }`} // Highlight active suggestion
              >
                {product.description} - {currency}
                {fmt.format(product.sp)}
              </li>
            ))}
          </ul>
        )}

            {selectedProduct && (
              <div className="add-section" onKeyDown={handleKeyDown}>
                <p>
                  Selected: {selectedProduct.description} - {currency}{fmt.format(selectedProduct.sp)}
                </p>
                <div>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="1"
                    className="quantity-input"
                    autoFocus
                  />
                  <button onClick={handleAddToCart} className="add-button">
                    Add to List
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="cart-section">
            {cart.length === 0 ? (
              <table>
              <thead>
                <tr>
                  <td>DESCRIPTION</td>
                  <td>RATE</td>
                  <td>QTY</td>
                  <td>AMT</td>
                  <td>OPT</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} style={{fontSize:"1.4rem", padding: "20px"}}>No Items Selected</td>
                </tr>
              </tbody>
            </table>
            ) : (
              <table>
                <thead>
                  <tr>
                    <td>DESCRIPTION</td>
                    <td>RATE</td>
                    <td>QTY</td>
                    <td>AMT</td>
                    <td>OPT</td>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={index}>
                      <td>{item.description}</td>
                      <td>{currency}{fmt.format(item.sp)}</td>
                      <td>{item.quantity}</td>
                      <td>{currency}{fmt.format(item.sp * item.quantity)}</td>
                      <td>
                        <button
                          onClick={() => handleRemoveFromCart(item._id)}
                          className="remove-button"
                        >
                          <IoTrashBinOutline/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <hr />

          <div className="summary" style={{ textAlign: "right" }}>
            <table>
              <tr>
                <td>Total:</td> <td>{currency}{fmt.format(calculateTotal().toFixed(2))}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <div className="print-section">
      { (billFrom.trim()==="" || name.trim()==="" || cart.length===0) ? (
        <button className="print-button" disabled >
          Print
        </button>
      ) : (
        <button onClick={handleGenerateBillNumber} className="print-button"  >
          Print
        </button>
      )}
      </div>
    </div>
  );
};

export default BillingSystem;
