import React from 'react'
import Billlist from './Billlist';
import Billsearch from './Billsearch';
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
    <>
    <div className='container'>
    <h2>Transactions</h2>
    </div>
    <Billsearch showAlert={props.showAlert}/>
    <div className='container'>
      <Billlist showAlert={props.showAlert} />
    </div>
    </>
  )
}
