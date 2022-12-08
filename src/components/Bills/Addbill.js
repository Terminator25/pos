import React, { useContext, useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import BillContext from "../../context/bills/BillContext";
import PaymentContext from "../../context/payment/PaymentContext";
// import Billlist from "./Billlist"
import { v1 as uuidv1 } from "uuid";

export default function Addbill(props) {
  const context = useContext(BillContext);
  const {
    productlist,
    customers,
    addBill,
    getProducts,
    bills,
    getBills,
    getCustomers,
    addCustomer,
  } = context;

  const paycontext = useContext(PaymentContext);
  const { tstoken, initialize, update } = paycontext;

  const [bill, setBill] = useState({
    total: "",
    paymentmode: "Cash",
    billnumber: uuidv1().substring(0, 8),
    customer: {},
    discount: 0,
    amount: "",
    gst: 0,
    products: [],
  });

  //Get required data from backend
  useEffect(() => {
    getProducts();
    getBills();
    getCustomers();
    //eslint-disable-next-line
  }, []);

  //Initial Values stored in customer state
  let initialcust = { name: "", gst: "", address: "", phno: "", email: "" };

  //Initial values stored in item state
  let initialitem = { pname: "", price: "", quantity: 1 };

  //Change value of variables in state
  const onChange = (e) => {
    setBill({ ...bill, [e.target.name]: e.target.value });
  };

  //State to set hidden items
  const [hide, setHide]=useState([]);
  
  //Dynamically set price of item from prodductlist array
  const [total, setTotal] = useState(0);
  
  //State for adding an item to product array
  const [item, setItem] = useState(initialitem);
  
  //State for creating a product array
  const [products, setProducts] = useState([]);
  
  //Create a customer state
  const [customer, setCustomer] = useState(initialcust);

  //State of initial call flag
  const [initial, setIni] = useState(false)

  //State of modal for transaction status
  const [show, setShow] = useState(false);

  //State for transaction data
  const [txndata, setTxndata] = useState({});

  const Increment = (element) => {
    let index = element;
    let newArr = [...products];
    newArr[index].quantity += 1;
    setProducts(newArr);
  };

  const Decrement = (element) => {
    let index = element;
    let newArr = [...products];
    newArr[index].quantity -= 1;
    setProducts(newArr);
  };

  //Display price of product when selected dynamically
  useEffect(() => {
    productlist.map((product) => {
      // if (product.pname === item.pname)
      return product.pname === item.pname
        ? setItem((prevState) => ({ ...prevState, price: product.price }))
        : "";
    });
  }, [item.pname, productlist]);

  //Populate customer details
  useEffect(() => {
    customers.map((user) => {
      // if(user.name === customer.name)
      return user.name === customer.name
        ? setCustomer((prevState) => ({
            ...prevState,
            gst: user.gst,
            address: user.address,
            phno: user.phno,
            email: user.email,
          }))
        : "";
    });
  }, [customer.name, customers]);

  //If customer.name value input is equivalent to blank/null value, clear all customer fields
  useEffect(() => {
    (function () {
      //Reg Ex Pattern indicates digit at beginning or null found
      if (/^(?:[0-9]{1}|)$/.test(customer.name))
        setCustomer((prevState) => ({
          ...prevState,
          gst: "",
          address: "",
          phno: "",
          email: "",
        }));
    })();
  }, [customer.name]);

  //Update customer state
  const handleCustomer = (e) => {
    const { name, value } = e.target;
    setCustomer((prevState) => ({ ...prevState, [name]: value }));
  };

  //Update item state
  const handleProduct = (e) => {
    const { name, value } = e.target;
    setItem((prevState) => ({ ...prevState, [name]: value }));
  };

  //Add item state to the product array
  const handleClickProduct = (e) => {
    // e.preventDefault();
    setProducts((current) => [...current, item]);
    setHide([...hide, item.pname])
    setItem(initialitem);
    props.showAlert("Item Added!", "success");
  };

  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    if (item.pname !== "" && item.price !== "") {
      // && item.quantity!=="")
      handleClickProduct();
    }
    //eslint-disable-next-line
  }, [item]);

  function openJsCheckoutPopup(orderId, txnToken, amount) {
    console.log(orderId);
    console.log(txnToken);
    console.log(amount);
    var config = {
      root: "",
      flow: "DEFAULT",
      data: {
        orderId: orderId,
        token: txnToken,
        tokenType: "TXN_TOKEN",
        amount: amount,
      },
      payMode: {
        order: ["BALANCE", "UPI", "CARD", "NB"],
      },
      merchant: {
        redirect: false,
      },
      handler: {
        transactionStatus: function transactionStatus(paymentStatus) {
          console.log("paymentStatus => ", paymentStatus);
          window.Paytm.CheckoutJS.close();
          (paymentStatus.STATUS === 'TXN_SUCCESS'? props.showAlert("Transaction Successful", "success"): props.showAlert("Transaction Failed", "danger"));
          setTxndata(paymentStatus);
          setShow(true);
        },
        notifyMerchant: function (eventName, data) {
          console.log("notifyMerchant handler function called");
          console.log("eventName => ", eventName);
          console.log("data => ", data);
        },
      },
    };
    if (window.Paytm && window.Paytm.CheckoutJS) {
      // initialze configuration using init method
      window.Paytm.CheckoutJS.init(config)
        .then(function onSuccess() {
          // after successfully updating configuration, invoke checkoutjs
          window.Paytm.CheckoutJS.invoke();
        })
        .catch(function onError(error) {
          console.log("error => ", error);
        });
    }
  }

  const handleRemoveItem = (e) => {
    e.preventDefault();
    const name = e.target.getAttribute("value");
    let newArr = products.filter((product) => product.pname !== name);
    let show = hide.filter((hid) => hid!==name);
    setHide(show);
    setProducts(newArr);
    props.showAlert("Item Removed!", "success");
  };

  // const delay = ms => new Promise(
  //   resolve => setTimeout(resolve, ms)
  //   );

  const CalculateTotal = (e) => {
    e.preventDefault();
    let value = cost - (cost * bill.discount) / 100;
    let final_value = value + (value * bill.gst) / 100;
    setTotal(final_value);


    if(bill.paymentmode!=="Cash"){
    (initial?update(final_value, bill.billnumber, tstoken.txntoken) :initialize(final_value, bill.billnumber));
    setIni(true);}
    // let billnumber = "billnumber";
    // setBill({ ...bill, [billnumber]: uuidv1().substring(0, 8) });

  };

  const handleClickPayment = async (event) => {
    event.preventDefault();
    console.log(tstoken);
    // await delay(10000);

    openJsCheckoutPopup(tstoken.orderid, tstoken.txntoken, tstoken.amount);
  };

  const handleClick = (e) => {
    e.preventDefault();
    let present = false;
    let mess = "";
    for (let index = 0; index < bills.length; index++) {
      const element = bills[index];
      if (element.billnumber === bill.billnumber) {
        present = true;
        mess = "Bill Number cannot be same";
        break;
      }
    }

    let newcust = true;
    for (let index = 0; index < customers.length; index++) {
      const element = customers[index];
      if (element.phno === customer.phno) {
        newcust = false;
        break;
      }
    }
    if (newcust) {
      addCustomer(
        customer.name,
        customer.phno,
        customer.email,
        customer.address,
        customer.gst
      );
      props.showAlert("New Customer Added", "success");
    }
    if (present) {
      props.showAlert(mess, "danger");
    } else {
      //Add values to the data base
      addBill(
        (bill.total = total),
        bill.paymentmode,
        bill.billnumber,
        (bill.customer = customer),
        bill.discount,
        (bill.amount = cost),
        bill.gst,
        (bill.products = products)
      );

      //Reset all values to the initial on click
      setBill({
        total: "",
        paymentmode: "Cash",
        billnumber: uuidv1().substring(0, 8),
        customer: setCustomer(initialcust),
        discount: 0,
        amount: "",
        gst: 0,
        products: setProducts([]),
      });

      setTotal(0);
      setHide([]);
      props.showAlert("Customer Added!", "success");
    }
  };

  //Calculate cost of all items
  let cost = products.reduce((accumulator, { price, quantity }) => {
    return accumulator + price * quantity;
  }, 0);
  
  useEffect(() => {
    if(cost>=250 & cost<500){
      setBill({ ...bill, discount: 5 })
    }
    else if(cost>=500 & cost<1000){
      setBill({ ...bill, discount: 10 })
    }
    else if(cost>=1000){
      setBill({ ...bill, discount: 20 })
    }
    else{      
      setBill({ ...bill, discount: 0 })
    }
    //eslint-disable-next-line
  }, [cost])

  return (
    <div>
      <div>
        <div className="container my-3">
          <h2>Billing</h2>
          <form className="my-3">
            <div>
              <div className="row">
                <h4>Customer Details</h4>
                <div className="col-sm mb-3">
                  <label>Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    onChange={handleCustomer}
                    value={customer.name}
                    list="names"
                    placeholder="Customer Name"
                  />
                  <datalist id="names">
                    {customers.map((user) => {
                      return <option key={user._id}>{user.name}</option>;
                    })}
                  </datalist>
                </div>
                <div className="col-sm mb-3">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phno"
                    onChange={handleCustomer}
                    value={customer.phno}
                  />
                </div>
                {/* <div className="col-sm mb-3">
                  <label>GST ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="gst"
                    onChange={handleCustomer}
                    value={customer.gst}
                  />
                </div>
                <div className="col-sm mb-3">
                  <label>Email Address</label>
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    onChange={handleCustomer}
                    value={customer.email}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm mb-3">
                  <label>Address</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    onChange={handleCustomer}
                    value={customer.address}
                  />
                </div> */}
              </div>
            </div>
            <div className="row">
              <div className="col-sm mb-3">
                <label>Payment Mode</label>
                <select
                id='paymentmode'
                name='paymentmode'
                className="form-select"
                aria-label="Payment Mode"
                onChange={onChange}
                value={bill.paymentmode}
                >
                  <option key="1">Cash</option>
                  <option key="2">UPI/Wallet</option>
                  <option key="3">Credit/Debit Card</option>
                  <option key="4">Net Banking</option>
                </select>
                {/* <input
                  type="text"
                  className="form-control"
                  name="paymentmode"
                  onChange={onChange}
                  value={bill.paymentmode}
                  list="payments"
                />
                <datalist id="payments">
                  <option key="1">Cash</option>
                  <option key="2">UPI</option>
                  <option key="3">Credit/Debit Card</option>
                </datalist> */}
              </div>
              <div className="col-sm mb-3">
                <label>Bill Number</label>
                <input
                  type="text"
                  className="form-control"
                  name="billnumber"
                  onChange={onChange}
                  value={bill.billnumber}
                />
              </div>
            </div>
            <div className="row">
              <h4>Products</h4>
              <div className="col-sm mb-3">
                <label>Name</label>
                <input
                  type="text"
                  id="1"
                  name="pname"
                  className="form-select"
                  aria-label="Product select"
                  onChange={handleProduct}
                  list="items"
                  placeholder="Select Product"
                  value={item.pname}
                />
                <datalist id="items">
                  {productlist.map((product) => {return( (hide.includes(product.pname)?null:<option key={product._id}>{product.pname}</option>));
                  })}
                </datalist>
              </div>
              <div className="col-sm mb-3">
                <label>Price</label>
                <input
                  id="2"
                  type="text"
                  className="form-control"
                  name="price"
                  onChange={handleProduct}
                  value={item.price}
                />
              </div>
              <div className="col-sm mb-3">
                <label>Quantity</label>
                <input
                  id="3"
                  type="text"
                  className="form-control"
                  name="quantity"
                  onChange={handleProduct}
                  value={item.quantity}
                />
              </div>
            </div>
            <div className="mb-3">
              <ul className="list-group">
                {products.map((product, index) => {
                  return (
                    <li
                      className="list-group-item d-flex justify-content-between align-items-center"
                      key={product.pname} value={product.pname}
                    >
                      <span className="flex-grow-1">{product.pname} </span>
                      <span className="badge bg-primary rounded mx-1">
                        Price:{product.price}{" "}
                      </span>
                      <span className="badge bg-primary rounded mx-1">
                        Quantity:
                        <button
                          type="button"
                          className="badge bg-primary rounded mx-1"
                          onClick={() => Decrement(index)}
                          disabled={product.quantity < 2}
                        >
                          -
                        </button>
                        {/* {product.quantity} */}
                        {product.quantity}
                        {/* <input type="number" name="quantity" value={product.quantity} min="1" max="1000" step="1"/> */}
                        <button
                          type="button"
                          className="badge bg-primary rounded mx-1"
                          onClick={() => Increment(index)}
                        >
                          +
                        </button>
                      </span>
                      <button
                        className="badge bg-danger rounded-pill"
                        onClick={handleRemoveItem}
                        value={product.pname}
                      >
                        {" "}
                        X
                      </button>
                    </li>
                  );
                })}
              </ul>
              <br />
              <span>
                <strong>Amount is : </strong>
                {cost}
              </span>
            </div>
            <div className="row">
              <div className="col-sm mb-3">
                <label>Discount (Percent) </label>
                <input
                  type="text"
                  className="form-control"
                  name="discount"
                  onChange={onChange}
                  value={bill.discount}
                />
              </div>
              <div className="col-sm mb-3">
                <label>GST (Percent)</label>
                <input
                  type="text"
                  className="form-control"
                  name="gst"
                  onChange={onChange}
                  value={bill.gst}
                />
              </div>
            </div>
            <div className="mb-3 d-flex justify-content-start">
              <button
                type="submit"
                className="btn btn-primary mb-3"
                onClick={CalculateTotal}
              >
                Calculate Total
              </button>
              <span className="mx-4">
                <strong>The Total is : </strong>
                {total}
              </span>
              {bill.paymentmode!=="Cash"?
              (<button
                disabled={total===0}
                type="submit"
                className="btn btn-primary mb-3"
                onClick={handleClickPayment}
              >
                Pay Now
              </button>): null}
            </div>
            <button
              disabled={total===0}
              type="submit"
              className="btn btn-primary"
              onClick={handleClick}
            >
              Create Bill
            </button>
          </form>
        </div>
        {/* <div className="row">      
          <Billlist showAlert={props.showAlert} />
        </div> */}
      </div>
      <Modal show={show}>

        <Modal.Header>

          <Modal.Title>Transaction Details</Modal.Title>

        </Modal.Header>

        <Modal.Body>

          <ul className="list-group">
            <li>Transaction Status : {txndata.RESPMSG}</li>
            <li>Payment Mode : {txndata.PAYMENTMODE}</li>
            <li>Bill Number : {txndata.ORDERID}</li>
            <li>Amount : {txndata.TXNAMOUNT}</li>
            <li>Date : {txndata.TXNDATE}</li>
          </ul>

        </Modal.Body>

        <Modal.Footer>

          <Button variant="secondary" onClick={handleClose}>Close Modal</Button>

        </Modal.Footer>

      </Modal>
    </div>
  );
}