import React from 'react'
import Navbar from './components/navbar/navbar'
import Sidebar from './components/sidebar/sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add/add'     
import List from './pages/List/list'   
import Order from './pages/Order/order'
import { assets, url } from './assets/assets'
import { ToastContainer , toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => (
  <div>
    <ToastContainer />
    <Navbar />
    <hr />
    <div className="app-content">
      <Sidebar />
      <Routes>
        <Route path="/add" element={<Add url={url} />} />
        <Route path="/list" element={<List url={url} />} />
        <Route path="/order" element={<Order url={url} />} />
      </Routes>
    </div>
  </div>
)

export default App