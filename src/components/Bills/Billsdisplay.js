import React from 'react'
import Billsearch from "./Billsearch"
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Bills(props) {
  let navigate= useNavigate();
  useEffect(()=>{
    if(!localStorage.getItem('token'))
    {navigate('/login');
    props.showAlert("User Needs to be logged in", "danger")}
  })
  return (
    <div className='container'>
      <Billsearch showAlert={props.showAlert}/>
    </div>
  )
}
