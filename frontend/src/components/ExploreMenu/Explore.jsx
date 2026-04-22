import React from 'react'
import'./Explore.css'
import { menu_list } from '../../assets/assets'

const Explore = ({category,setCategory}) => {
  return (
    <div className='ExploreMenu' id='ExploreMenu'>
      <h1>Explore Our Menu</h1>
      <p className='exploreMenu-text'>Choose from a diverse menu featuring a delectable array of dishes.Our mission is to satisfy your cravings and elevate your dining experience,one delecious meal at a time.</p>
        <div className="explore-menu-list">
            {menu_list.map((item, index) => {
                return (
                <div onClick={()=>setCategory(prev=>prev===item.menu_name ? "All":item.menu_name)} key={index} className="exploreMenu-items">
                    <img className={category===item.menu_name?"active":"" }src={item.menu_image} alt="" />
                    <p>{item.menu_name}</p>
                </div>
                );
            })}
        </div>
        <hr />
    </div>
    
  )
}

export default Explore
