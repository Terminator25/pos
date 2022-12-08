import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import PdfDownloader from "../PdfDownloader";
import BillContext from "../../context/bills/BillContext"

export default function Billitem(props) {
  const context = useContext(BillContext);

  const { bill, updateBill, removebill } = props;

  const {deleteBill} = context;
  let initialcust = { name: "", gst: "", address: "", phno: "", email: "" };

  const [products, setProducts] = useState([]);

  const [customer, setCustomer] = useState(initialcust);

  const [timeDate] = useState(bill.time);

  //Total number of items present in the bill
  let total_count = 0;

  const Date = timeDate?.split("T")?.[0];
  const GetDate = moment(Date).format("DD-MM-YYYY");
  const Time = timeDate?.split("T")?.[1]?.split(".")?.[0];

  useEffect(() => {
    setProducts(bill.products);
    if (bill.customer != null) setCustomer(bill.customer);
  }, [bill]);

  const handleClick = (e)=>{
  
    if(!window.confirm("Are You Sure you want to delete?"))
    {
      props.showAlert("Operation Cancelled!", "danger")
    }

    else{
        deleteBill(bill._id);
        if(removebill)
        {removebill(bill)};
      props.showAlert("Bill Deleted!", "success");}

  }

  return (
    <div className="container col">
      <div
        className="card my-3"
        style={{ width: "35rem" }}
        id={bill.billnumber}
      >
        <div className="card-body" style={{ fontSize: "0.75rem" }}>
          <h4 className="d-flex justify-content-center">
            Elite Web Technologies
          </h4>
          <h5 className="d-flex justify-content-center">Sector 5 MDC</h5>
          <span className="card-title mx-3">
            Bill Number: {bill.billnumber}
          </span>
          <div className="card-text">
            <div className="row">
              {customer.phno !== undefined ? (
                <div className="col my-2">
                  <span className="mx-3">
                    Customer Name: {customer.name}
                    <br />
                  </span>
                  <span className="mx-3">
                    Number: {customer.phno}
                    <br />
                  </span>
                  {customer.email !== undefined ? (
                    <span className="mx-3">
                      Email ID: {customer.email}
                      <br />
                    </span>
                  ) : null}
                  {customer.address !== undefined ? (
                    <span className="mx-3">
                      Address: {customer.address}
                      <br />
                    </span>
                  ) : null}
                  {customer.gst !== "0" ? (
                    <span className="mx-3">
                      GST ID: {customer.gst}
                      <br />
                    </span>
                  ) : null}

                </div>
              ) : null}
              <div className="col my-2">
                <span className="mx-3">
                  Time: {Time}
                  <br />
                </span>
                <span className="mx-3">
                  Date of Creation: {GetDate}
                  <br />
                </span>
                <span className="mx-3">Payment Mode: {bill.paymentmode}</span>
              </div>
            </div>
            <span className="mx-3">Items:</span>
            <span>
              <div className="d-flex justify-content-between">
                <strong>
                  <span className="mx-4">Quantity</span>
                </strong>
                <strong>
                  <span>Rate</span>
                </strong>
                <strong>
                  <span className="mx-4">Amount</span>
                </strong>
              </div>
            </span>
            <div className="list-group">
              {products.map((product, index) => {
                total_count += product.quantity;
                return (
                  <li className="list-group-item" key={product.pname}>
                    <span>
                      {index + 1}. {product.pname}
                      <br />
                    </span>
                    <div className="row my-1">
                      <span className="col offset-1">{product.quantity}</span>
                      <span className="col-md-4 offset-3">
                        ₹{product.price}
                      </span>
                      <span className="col offset-1">
                        ₹{product.price * product.quantity}
                      </span>
                    </div>
                  </li>
                );
              })}
            </div>

            <span className="d-flex justify-content-between mx-3">
              <strong>Total Quantity: {total_count}</strong>
              <strong>Total Amount: ₹{bill.amount}</strong>
            </span>
            <div className="mx-3">
              {bill.discount !== 0 && (<span className="d-flex justify-content-end">Discount Applied: {bill.discount}%</span>)}
              {bill.gst !== 0 ? <span className="d-flex justify-content-end">GST Applied: {bill.gst}%</span> : null}
              <br />
              <span className="d-flex justify-content-end">
                <strong>Total: ₹{bill.total}</strong>
              </span>
              <div data-html2canvas-ignore="true">
                <PdfDownloader
                  DownloadFileName={bill.billnumber}
                  rootElementId={bill.billnumber}
                />
                <i className="fas fa-edit mx-2" onClick={()=>{updateBill(bill)}}></i>
                <i className="fa fa-trash mx-2" aria-hidden="true" onClick={handleClick}></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
