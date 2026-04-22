import React, { useState, useEffect } from "react";
import "./list.css";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({url}) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`);
      if (res.status === 200) {
        setList(res.data.data);
      }
    } catch (error) {
      toast.error("Error");
    }
  };

  const removeFood = async(foodId) =>{
    const res = await axios.post(`${url}/api/food/remove`,{id : foodId});
    await fetchList();

    if(res.status === 200){
      toast.success("Food Item Removed");
    }
    else{
      toast.error("Error");
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>Food Items List</p>

      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className="list-table-format data">
              <img src={`${url}/images/${item.image}`} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <p onClick ={()=>removeFood(item._id)} className="cursor">X</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;
