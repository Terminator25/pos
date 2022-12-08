import React from 'react'
import Addcustomer from "./Addcustomer"
import Customerlist from "./Customerlist"
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Customers(props) {
  let navigate= useNavigate();
  useEffect(()=>{
    if(!localStorage.getItem('token'))
    {navigate('/login');
    props.showAlert("User Needs to be logged in", "danger")}
  })
  return (
    <div className='container'>
      <Addcustomer showAlert={props.showAlert} />
      <div className="row my-3">
        <Customerlist showAlert={props.showAlert} />
      </div>
    </div>
  )
}
