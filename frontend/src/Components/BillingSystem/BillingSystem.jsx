import React, { useState } from "react";
import "./BillingSystem.css";
import { currency } from "../../App";
import axios from "axios";
import { backendUrl } from "../../App";
import { IoTrashBinOutline  } from "react-icons/io5"
import logo from "../../assets/logo.png"

const BillingSystem = ({products}) => {

  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [billNumber,setBillNumber] = useState("");
  const [name, setName] = useState("");

  const addHistory = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/billinghistory/add', {
        billTo : name,
        products : cart,
        billNum : billNumber
      })
      console.log("history saved successfully")
    } catch (error) {
      console.log(error)
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
    setName("");
  };

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.sp * item.quantity, 0);
  };

  const handlePrint = async () => {
    const printWindow = window.open("", "", "width=800,height=600");
    console.log(name)
    const cartItems = cart
      .map(
        (item) => `<tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>${currency}${item.sp}</td>
                  <td>${currency}${item.sp * item.quantity}</td>
                </tr>`
      )
      .join("");
    const total = calculateTotal().toFixed(2);

    printWindow.document.write(`
      <html>
        <head>
          <title>Bill</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border : 2px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h2 { margin : 0px; text-align : center; }
            img{ width : 200px; position : relative; left : 50%; translate : -50%; margin-bottom : 10px;}
          </style>
        </head>
        <body>
          <img src=${logo} alt="LOGO" />
          <table>
            <thead>
              <tr>
                <td colspan="4"><h2>Invoice</h2></td>
              </tr>
              <tr>
                <td colspan="2">
                  <p style="display:flex; gap: 10px; flex-direction : column;">
                    <span><b>Bill Number</b> : ${billNumber}</span>
                    <span><b>Bill To</b> : ${name}</span>
                  </p>
                </td>
                <td colspan="2">
                  <p style="display:flex; gap: 10px; flex-direction : column;">
                    <span><b>Date</b> : ${new Date().toLocaleDateString()}</span>
                    <span><b>Time</b> : ${new Date().toLocaleTimeString()}</span>
                  </p>
                </td>
              </tr>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${cartItems}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3"><b>Total</b></td><td><b>${currency}${total}</b></td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
    await addHistory();
  };

  const generateBillNumber = async () => {
    await setBillNumber(String(Math.floor(100000 + Math.random() * 900000)));
    await handlePrint();
  };

  return (
    <div className="billing-system">
      <header>
        <img src={logo} alt="Logo" className="logo" />
      </header>

      <div className="main-container">
        <div className="name">
          <input type="text" name="name" placeholder="Customer Name" value={name} onChange={e=>setName(e.target.value)} autoFocus required />
        </div>
        <div className="centered">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search product"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
              required
            />
            {search.length > 0 && !selectedProduct && (
              <ul className="suggestion-list">
                {products
                  .filter((product) =>
                    product.description.toLowerCase().includes(search.toLowerCase())
                  )
                  .slice(0, 4)
                  .map((product, index) => (
                    <li
                      key={index}
                      onClick={() => setSelectedProduct(product)}
                      className="suggestion-item"
                    >
                      {product.description} - {currency}{product.sp}
                    </li>
                  ))}
              </ul>
            )}

            {selectedProduct && (
              <div className="add-section">
                <p>
                  Selected: {selectedProduct.description} - {currency}{selectedProduct.sp}
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
                      <td>{currency}{item.sp}</td>
                      <td>{item.quantity}</td>
                      <td>{currency}{item.sp * item.quantity}</td>
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
                <td>Total:</td> <td>{currency}{calculateTotal().toFixed(2)}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <div className="print-section">
      { cart.length===0 ? (
        <button onClick={handlePrint} className="print-button" disabled >
          Print
        </button>
      ) : (
        <button onClick={generateBillNumber} className="print-button"  >
          Print
        </button>
      )}
      </div>
    </div>
  );
};

export default BillingSystem;
