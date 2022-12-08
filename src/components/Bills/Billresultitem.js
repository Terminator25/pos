import React, { useState, useEffect } from "react";
import moment from "moment";

export default function Billitem(props) {
  const { bill } = props;

  let initialcust = { name: "", gst: "", address: "", phno: "", email: "" };

  const [products, setProducts] = useState([]);

  const [customer, setCustomer] = useState(initialcust);

  const [timeDate]= useState(bill.time)

  const Date = timeDate?.split('T')?.[0]
  const GetDate = moment(Date).format('DD-MM-YYYY');
  const Time = timeDate?.split('T')?.[1]?.split('.')?.[0];

  
  useEffect(() => {
    
    setProducts(bill.products);
    if(bill.customer!=null)
        setCustomer(bill.customer);
  }, [bill]);

  return (
    <div className="container">
      <div className="card my-3">
        <div className="card-body">
          <h5 className="card-title">Bill Number: {bill.billnumber}</h5>
          <div className="card-text">
            <div className="row my-2">
             {customer.name!==undefined && <span className="col-sm-6 mx-3">Customer Name: {customer.name}</span>}
             {customer.phno!==undefined && <span className="col-sm-4">Number: {customer.phno}</span>}
            </div>
            <div className="row my-2">
              {customer.address!==undefined && (<span className="mx-3">Address: {customer.address}</span>)}
            </div>
            <div className="row y-2">
              <span className="col mx-3">Date of Creation: {GetDate}</span>
              <span className="col mx-3">Time: {Time}</span>
            </div>
            <div className="row my-2">
              {customer.gst!=="0" &&<span className="col-sm-3 mx-3">GST ID: {customer.gst}</span>}
              {customer.email!==undefined &&<span className="col-sm-3 mx-3">Email ID: {customer.email}</span>}
              <span className="col-sm-3 mx-3">Payment Mode: {bill.paymentmode}</span>
            </div>
            <span className="mx-3">Items:</span>
            {products.map((product) => {
              return (
                <li
                  className="list-group-item d-flex justify-content-between align-items-center"
                  key={product.pname}
                >
                  <span className="flex-grow-1">{product.pname} </span>
                  <span className="badge bg-primary rounded mx-1">
                    Price:{product.price}{" "}
                  </span>
                  <span className="badge bg-primary rounded mx-1">
                    Quantity:{product.quantity}
                  </span>
                </li>
              );
            })}
            <span className="mx-3 my-2"><strong>Amount: {bill.amount}</strong></span>
            
            <br />
            <div className="row my-2">
              {bill.discount!==0 && <span  className="col-sm-6 mx-3">Discount Applied: {bill.discount}</span>}
              {bill.gst!==0 && <span className="col-sm-4 mx-3">GST Applied: {bill.gst}</span>}
            </div>
            <span className="mx-3 my-2"><strong>Total: {bill.total}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
