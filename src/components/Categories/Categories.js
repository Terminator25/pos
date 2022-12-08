import Categorylist from "./Categorylist";
import AddCategory from "./AddCategory";
import React from 'react';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Categories(props) {
  let navigate= useNavigate();
  useEffect(()=>{
    if(!localStorage.getItem('token'))
      {navigate('/login');
      props.showAlert("User Needs to be logged in", "danger")}
  })
  return (
    <div className="container">
      <AddCategory showAlert={props.showAlert} />
      <div className="row my-3">
        <Categorylist showAlert={props.showAlert} />
      </div>
    </div>
  );
}
