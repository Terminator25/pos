import React, { useContext, useState } from "react";
import CustomerContext from "../../context/customers/CustomerContext";
import { useNavigate } from "react-router-dom";
// import { Modal, Button } from "react-bootstrap";
import BillContext from "../../context/bills/BillContext";


export default function Customeritem(props) {
    const context = useContext(CustomerContext);
    const { customer, updateCustomer } = props;
    const { deleteCustomer} = context;

    // const billcontext = useContext(BillContext)
    // const { findBills, result } = billcontext 
  
    // const [show, setShow] = useState(false);

    // const handleClose = () => setShow(false);
    // const handleShow = () =>{ 
    //   setShow(true); 
    //   findBills(customer._id);
    // }

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
      navigate('/billdisplay', {state: customer.name})
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
        {/* <i className="fas fa-download mx-2" aria-hidden="true" onClick={handleShow}></i> */}
      </div>
    </div>
      {/* <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Customer Purchase History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {result.map()}
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Save Changes
        </Button>
        </Modal.Footer>
      </Modal> */}
    </div>
  )
}
