import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-left">
            <img src={assets.logo} alt="" />
            <p>Tomato brings your favorite meals right to your doorstep. Whether it’s a quick snack, a hearty meal, or a sweet treat, we deliver fresh, hot, and tasty food anytime, anywhere. Your cravings, our priority!</p>
            <div className='footer-socialIcons'>
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className="footer-center">
            <h2>COMPANY</h2>
            <ul>
                <li>Home</li>
                <li>About Us</li>
                <li>Delivery</li>
                <li>Privacy Policy</li>
            </ul>
        </div>
        <div className="footer-left">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>+91-8527415782</li>
                <li>contact-: abhi1210sharma@gmail.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2025 @ Tomato.com - All Right Reserved.</p>
    </div>
  )
}

export default Footer
