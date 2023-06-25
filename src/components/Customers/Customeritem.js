import React, { useContext, useEffect, useState } from "react";
import CustomerContext from "../../context/customers/CustomerContext";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import BillContext from "../../context/bills/BillContext";
import moment from "moment";
import { DateRange } from "react-date-range";
import PdfDownloader from "../PdfDownloader";


export default function Customeritem(props) {
    const context = useContext(CustomerContext);
    const { customer, updateCustomer } = props;
    const { deleteCustomer} = context;

    const billcontext = useContext(BillContext)
    const { findBills, result } = billcontext 
  
    const [show, setShow] = useState(false);
    const [selectDate, setSelectDate] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () =>{ 
      setShow(true); 
      findBills(customer._id, dates, "");
    }

    const [dates, setDate] = useState([
      {
        startDate: new Date(),
        endDate: null,
        key: 'selection'
      }
    ])

    const setRange = (e)=>{
      setDate([e.selection]);
    };

    const handleClick = (e)=>{
  
      if(!window.confirm("Are You Sure you want to delete?"))
      {
        props.showAlert("Operation Cancelled!", "danger")
      }
  
      else{
      
          deleteCustomer(customer._id); 
        props.showAlert("Customer Deleted!", "success");}
  
    }

    const [report, setReport] = useState(result);

    useEffect(()=>{
        setReport(result)
      },[result]);

    const navigate = useNavigate();
    const onClick = (e)=>{
      // let path=`/billdisplay`
      // navigate(path);
      navigate('/billhistory', {state: customer.name})
      // findBills(customer.phno);      
    }

    const onClickDate = (e) =>{
      e.preventDefault();
      setSelectDate(!selectDate);
    }

    const findReports = (e) =>{
      e.preventDefault();
  
      findBills(
          customer._id,
          dates,
          ""
          );
      props.showAlert("Searching", "success");
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
        <i className="fas fa-download mx-2" aria-hidden="true" onClick={handleShow}></i>
      </div>
    </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Customer Purchase History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="search">
            <label>Bill Range</label>
              <br/>
              <button className="bg-white rounded text-black my-1" onClick={onClickDate}>Open Calendar</button>
              {selectDate ?(<DateRange
                  editableDateInputs={true}
                  onChange={setRange}
                  moveRangeOnFirstSelection={false}
                  ranges={dates}
                  dateDisplayFormat="dd-MM-yyyy"
              />): null}
            <button id='search' className="bg-primary rounded text-white my-1 mx-2" type="submit" onClick={findReports}>Submit</button>
          </div>
          <div className="report"  id={customer._id}>
            <div className="customer mt-3">
            Customer Name: <strong>{customer.name}</strong>
            {(customer.phno!==undefined)?(<p className="card-text">Mobile Number: <strong>{customer.phno}</strong></p>):null}
            </div>
            <div className="d-flex justify-content-between p-2">
              <span className="ms-2"><strong>Date</strong></span>
              <span className="ms-5"><strong>Amount</strong></span>
              <span><strong>Bill Number</strong></span>
            </div>
            <div>
              <ul className="list-group">
                {report.map((bill)=>{
                    const Date = bill.time?.split("T")?.[0];
                    const GetDate = moment(Date).format("DD-MM-YYYY");
                  return(
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{GetDate}</span>
                      <span>{bill.total}</span>
                      <span>{bill.billnumber}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <PdfDownloader
                  DownloadFileName={customer.name}
                  rootElementId={customer._id}
                />
        </Modal.Footer>
      </Modal>
    </div>
  )
}
