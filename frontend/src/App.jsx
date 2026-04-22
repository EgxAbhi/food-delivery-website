import React, { useState } from 'react'
import NavBar from './components/NavBar/NavBar/NavBar'
import { Route , Routes } from 'react-router-dom'
import PlaceOrder from './pages/Place Order/PlaceOrder';
import Cart from './pages/Cart/Cart';
import Home from './pages/Home/Home';
import Footer from './components/Footer/Footer';
import LoginPop from './components/LoginPopUp/LoginPop';
import Verify from './pages/verify/verify';
import MyOrders from './pages/MyOrders/MyOrders';

const App = () => {
  const [showLogin,setShowLogin] = useState(false)
  return (
    <>
    {showLogin?<LoginPop setShowLogin={setShowLogin}/>:<></>}
      <div className='app'>
        <NavBar setShowLogin={setShowLogin}/>
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/myOrders" element={<MyOrders />} />
        </Routes>
      </div>
      <Footer/>
    </>
    
  )
}

export default App
