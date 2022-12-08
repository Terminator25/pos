import React, { useContext, useState, useEffect } from "react";
import CustomerContext from "../../context/customers/CustomerContext";
var validator = require("email-validator");

export default function Addcustomer(props) {
  const context = useContext(CustomerContext);
  const { customers, addCustomer, getCustomer } = context;

  const [customer, setCustomer] = useState({
    name: "",
    gst: "",
    address: "",
    phno: "",
    email: "",
  });

  useEffect(() => {
    getCustomer();
    // eslint-disable-next-line
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    let present = false;
    let mess = "";

    //console.log(customers);

    for (let index = 0; index < customers.length; index++) {
      const element = customers[index];

      console.log(element, customer);

      if (element.phno === customer.phno) {
        present = true;
        mess = "Customer with same mobile number already exists";
        break;
      }
    }

    if (present) {
      props.showAlert(mess, "danger");
    } else {
      addCustomer(
        customer.name,
        customer.phno,
        customer.email,
        customer.address,
        customer.gst
      );

      setCustomer({
        name: "",
        gst: "",
        address: "",
        phno: "",
        email: "",
      });

      props.showAlert("Customer Added!", "success");
    }
  };

  const onChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div>
        <div className="container my-3">
          <h2>Add a Customer</h2>
            <form className="my-3">
              <div className="row">
              <div className="col-sm mb-6">
                <div className="mb-2">
                  <label htmlFor="name" className="form-label">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    onChange={onChange}
                    value={customer.name}
                    required
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="phno" className="form-label">
                    Mobile Number
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="phno"
                    name="phno"
                    onChange={onChange}
                    value={customer.phno}
                    required
                  />
                </div>
              </div>
              <div className="col-sm mb-6">
                <div className="mb-2">
                  <label htmlFor="email" className="form-label">
                    Email id
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    onChange={onChange}
                    value={customer.email}
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="shortname" className="form-label">
                    GST
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="gst"
                    name="gst"
                    onChange={onChange}
                    value={customer.gst}
                  />
                </div>
                </div>
              </div>
              <div className="mb-2">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  onChange={onChange}
                  value={customer.address}
                />
              </div>

              <button
                disabled={
                  customer.name.length < 3 ||
                  customer.phno.length < 10 ||
                  !(validator.validate(customer.email) || customer.email === "")
                }
                type="submit"
                className="btn btn-primary"
                onClick={handleClick}
              >
                Add
              </button>
            </form>
          
        </div>
      </div>
    </div>
  );
}
