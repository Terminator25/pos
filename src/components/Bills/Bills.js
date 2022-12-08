import React from 'react'
import Addbill from "./Addbill"
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Bills(props) {
  let navigate= useNavigate();
  useEffect(()=>{
    if(!localStorage.getItem('token'))
    {navigate('/login');
    props.showAlert("User Needs to be logged in", "danger")}
  })
  return (
    <div className='container'>
      <Addbill showAlert={props.showAlert} />
    </div>
  )
}
