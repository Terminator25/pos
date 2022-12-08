import React from 'react'
import Addproduct from './Addproduct'
import Productlist from './Productlist'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Products(props) {
  let navigate= useNavigate();
  useEffect(()=>{
    if(!localStorage.getItem('token'))
    {navigate('/login');
    props.showAlert("User Needs to be logged in", "danger")}
  })
  return (
    <div className='container'>
        <Addproduct showAlert={props.showAlert} />
        <div className="row my-3">
          <Productlist showAlert={props.showAlert} />
        </div>
    </div>
  )
}
