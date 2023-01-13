import React, { useContext, useEffect, useRef, useState } from "react";
import CustomerContext from "../../context/customers/CustomerContext";
import Customeritem from "./Customeritem";
// var validator = require("email-validator");


export default function Customerlist(props) {

  const context = useContext(CustomerContext);
  const { customers, getCustomer, editCustomer} = context;

  useEffect(() => {
    getCustomer();
    // eslint-disable-next-line
  }, []);

  const [customer, setCustomer] = useState({
    id: "",
    ename: "",
    egst: "",
    eaddress: "",
    ephno: "",
    eemail: "",
    estate: "",
    epin: "",
    eentity: ""
  });

  const updateCustomer = (cust) => {
    ref.current.click();
    setCustomer({
      id: cust._id,
      ename: cust.name,
      egst: cust.gst,
      eaddress: cust.address,
      ephno: cust.phno,
      eemail: cust.email,
      estate: cust.state,
      epin: cust.pin,
      eentity: cust.entity
    });
  };

  const ref = useRef(null);
  const refClose = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleClick = (e) => {
    e.preventDefault();
    // let present = false;
    // let mess = "";

    // for (let index = 0; index < customers.length; index++) {
    //   const element = customers[index];
    //   if ((element.phno === customer.phno ) && (element._id !== customer.id )) {
    //     present = true;
    //     mess = "Customer with same mobile number already exists";
    //     break;
    //   }
    // }

    // if (present) {
    //     props.showAlert(mess, "danger");
    //   } else {
      // if(customer.ename===""){customer.ename=null};
      // if(customer.ephno===""){customer.ephno=null};
      // if(customer.eaddress===""){customer.eaddress=null};
      // if(customer.egst===""){customer.egst=null};
      // if(customer.eemail===""){customer.eemail=null};
      // if(customer.estate===""){customer.estate=null};
      // if(customer.epin===""){customer.epin=null};
      // if(customer.eentity===""){customer.eentity=null};

        editCustomer(customer.id,
          customer.ename,
          customer.ephno,
          customer.eemail,
          customer.eaddress,
          customer.egst,
          customer.estate,
          customer.epin,
          customer.eentity
          );

            props.showAlert("Customer Updated!", "success");

      // }
      setCustomer({id: "",
      ename: "",
      egst: "",
      eaddress: "",
      ephno: "",
      eemail: "",
      estate: "",
      epin: "",
      eentity: ""})
      refClose.current.click();

  };

  const onChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="container">
        {customers.length === 0 && "No Customers Found."}
      </div>
      <button
        type="button"
        ref={ref}
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit Customer
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <form className="my-3" onSubmit={handleSubmit}>
                
                <div className="mb-3">
                  <label htmlFor="ename" className="form-label">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="ename"
                    name="ename"
                    value={customer.ename}
                    onChange={onChange}
                    minLength={3}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="ephno" className="form-label">
                  Mobile Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="ephno"
                    name="ephno"
                    value={customer.ephno}
                    onChange={onChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="eemail" className="form-label">
                  Email id
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="eemail"
                    name="eemail"
                    value={customer.eemail}
                    onChange={onChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="eaddress" className="form-label">
                  Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="eaddress"
                    name="eaddress"
                    value={customer.eaddress}
                    onChange={onChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="egst" className="form-label">
                  GST
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="egst"
                    name="egst"
                    value={customer.egst}
                    onChange={onChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="estate" className="form-label">
                  State
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="estate"
                    name="estate"
                    value={customer.estate}
                    onChange={onChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="epin" className="form-label">
                  PIN
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="epin"
                    name="epin"
                    value={customer.epin}
                    onChange={onChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="eentity" className="form-label">
                  Customer/Company
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="eentity"
                    name="eentity"
                    value={customer.eentity}
                    onChange={onChange}
                  />
                </div>

              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                ref={refClose}
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                disabled={customer.ename.length < 3}
                type="button"
                onClick={handleClick}
                className="btn btn-primary"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row my-3">
        <h2>Saved Customers</h2> <br />
        <br />
        {/* {customers.map((customer) => {
          return (
            <Customeritem
              key={customer._id}
              updateCustomer={updateCustomer}
              customer={customer}
              showAlert={props.showAlert}
            />
          );
        })} */}

        {customers.filter(person=> person.entity==="Customer").map((customer) => {
          return (
            <Customeritem
            key={customer._id}
            updateCustomer={updateCustomer}
            customer={customer}
            showAlert={props.showAlert}
            />
          );
        })}

      <h2>Saved Companies</h2> <br />
      {customers.filter(person=> person.entity==="Company").map((customer) => {
          return (
            <Customeritem
              key={customer._id}
              updateCustomer={updateCustomer}
              customer={customer}
              showAlert={props.showAlert}
            />
          );
        })}  
      
      </div>
    </>
  )
}
