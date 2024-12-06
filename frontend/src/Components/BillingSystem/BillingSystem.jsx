import React, { useState } from "react";
import "./BillingSystem.css";
import { currency } from "../../App";
import axios from "axios";
import { backendUrl } from "../../App";
import { IoTrashBinOutline  } from "react-icons/io5"

const BillingSystem = ({products}) => {

  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [billNumber,setBillNumber] = useState("");

  const addHistory = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/billinghistory/add', {
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
  };

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.sp * item.quantity, 0);
  };

  const handlePrint = async () => {
    const printWindow = window.open("", "", "width=800,height=600");
    const cartItems = cart
      .map(
        (item) => `<tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.sp}</td>
                  <td>$${item.sp * item.quantity}</td>
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
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: none; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            div{ width: 100%; display: flex; justify-content: end; 
             table{
             width: 35%;
             border: none;
              tr{
                td:nth-child(1){
                  text-align: left;
                }
                td:nth-child(2){
                  text-align: right;
                }
              }
             }
            }
            .amount { text-align: right; margin-top: 20px; font-size: 16px; }
          </style>
        </head>
        <body>
          <h1>Invoice</h1>
          <div>
            <table>
              <tr>
                <td>Bill Number :</td> <td>${billNumber}</td>
              </tr>
              <tr>
                <td>Date :</td> <td>${new Date().toLocaleDateString()}</td>
              </tr>
              <tr>
                <td>Time :</td> <td>${new Date().toLocaleTimeString()}</td>
              </tr>
            </table>
          </div>
          <table>
            <thead>
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
          </table>
          <div class="amount">
            <p>Total: $${total}</p>
          </div>
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
        <h1>Quick Bills</h1>
      </header>

      <div className="main-container">
        <div className="centered">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search product"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
              autoFocus
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
