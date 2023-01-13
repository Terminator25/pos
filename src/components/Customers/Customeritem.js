import React, { useContext} from "react";
import CustomerContext from "../../context/customers/CustomerContext";
import { useNavigate } from "react-router-dom";


export default function Customeritem(props) {
    const context = useContext(CustomerContext);
    const { customer, updateCustomer } = props;
    const { deleteCustomer} = context;
  
    const handleClick = (e)=>{
  
      if(!window.confirm("Are You Sure you want to delete?"))
      {
        props.showAlert("Operation Cancelled!", "danger")
      }
  
      else{
      
          deleteCustomer(customer._id); 
        props.showAlert("Customer Deleted!", "success");}
  
    }
    const navigate = useNavigate();
    const onClick = (e)=>{
      // let path=`/billdisplay`
      // navigate(path);
      navigate('/billdisplay', {state: customer.phno})
      // findBills(customer.phno);      
    }

  return (
            <div className="col-md-3">
    <div className="card my-3">
      <div className="card-body">
        <h5 className="card-title">{customer.name}</h5>
        {(customer.phno!==undefined)?(<p className="card-text">Mobile Number: {customer.phno}</p>):null}
        <i className="fas fa-edit mx-2" onClick={()=>{updateCustomer(customer)}}></i>
        <i className="fa fa-trash mx-2" aria-hidden="true" onClick={handleClick}></i>
        <i className="fa fa-search mx-2" aria-hidden="true" onClick={onClick}></i>
      </div>
    </div>
  </div>
  )
}
