import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
// `food_list` is available via context; remove unused asset import to avoid shadowing

const PlaceOrder = () => {
  const { getTotal, token, food_list, cartItems, url } =
    useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChange = (event) => {
    const name = event.target.name;
    const value = event.target.value; // corrected typo
    setData((data) => ({ ...data, [name]: value }));
  };
  useEffect(() => {
    console.log(data);
  }, [data]);

  //AFTER CLICKING PROCEED TO PAYMENT
  const placeOrder = async (event) => {
    event.preventDefault();
    try {
      if (!token) {
        alert("Please log in to place an order");
        return;
      }
      let OrderItems = [];
      food_list.forEach((item) => {
        if (cartItems[item._id] > 0) {
          let itemInfo = { ...item };
          itemInfo["quantity"] = cartItems[item._id];
          OrderItems.push(itemInfo);
        }
      });
      let OrderData = {
        address: data,
        items: OrderItems,
        totalAmount: getTotal() + 2,
      };
      console.log("Sending order data:", OrderData);
      let response = await axios.post(url + "/api/order/place", OrderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else {
        alert(response.data.message || "Error placing order");
      }
    } catch (error) {
      console.error("Order error full response:", error.response?.data);
      console.error("Order error:", error);
      alert(error.response?.data?.message || "Failed to place order");
    }
  };
  const deliveryFee = 2;

  // Calculate totals
  const subtotal = getTotal();

  useEffect(()=>{
    if(!token){
      navigate('/cart')
    }
    else if(getTotal()===0){
      navigate('/cart')
    }
  },[token])
  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChange}
            value={data.firstName}
            type="text"
            placeholder="First Name"
          />
          <input
            required
            name="lastName"
            onChange={onChange}
            value={data.lastName}
            type="text"
            placeholder="Last Name"
          />
        </div>
        <input
          required
          pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
          name="email"
          onChange={onChange}
          value={data.email}
          type="email"
          placeholder="Email Address"
        />
        <input
          required
          name="street"
          onChange={onChange}
          value={data.street}
          type="text"
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={onChange}
            value={data.city}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            onChange={onChange}
            value={data.state}
            type="text"
            placeholder="State"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipcode"
            onChange={onChange}
            value={data.zipcode}
            type="number"
            placeholder="Pin Code"
          />
          <input
            required
            name="country"
            onChange={onChange}
            value={data.country}
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          name="phone"
          onChange={onChange}
          value={data.phone}
          type="number"
          placeholder="Phone"
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${subtotal}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery fee</p>
              <p>${getTotal() === 0 ? 0 : 2.0}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>${getTotal() === 0 ? 0 : getTotal() + 2}</p>
            </div>
          </div>
          <button type="submit">Proceed to Payment</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
