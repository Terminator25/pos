  import React, { useContext, useEffect, useState, useRef } from "react";
  import BillContext from "../../context/bills/BillContext";
  import Billitem from "./Billitem";
  import Button from "react-bootstrap/Button";
  import Modal from "react-bootstrap/Modal";
  import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
  import Tooltip from 'react-bootstrap/Tooltip';  

  export default function Billlist(props) {
    const context = useContext(BillContext);
    const { bills, getBills, productlist, getProducts, editBill } = context;

    //Initial values stored in item state
    let initialitem = { pname: "", price: "", quantity: 1 };

    const [item, setItem] = useState(initialitem);
    
    //State for creating a product array
    const [products, setProducts] = useState([]);

    //Create a customer state
    const [customer, setCustomer] = useState({ name: "", gst: "", address: "", phno: "", email: "" });

    //State to check cost change
    const [changecost, setChange] = useState(0)
    
    //State to update bill details
    const [bill, setBill] = useState({
      id: "",
      total: "",
      customer: {},
      discount: 0,
      amount: "",
      gst: 0,
      products: [],
      billnumber: ""
    });
    
    //State to hide or show modal
    const [show, setShow] = useState(false);

    //State to set hidden items
    const [edithide, setEdithide]=useState([]);
    
    //Dynamically set price of item from prodductlist array
    const [total, setTotal] = useState(0);
    
    const refClose = useRef(null);
    
    const handleSubmit = (e) => {
      e.preventDefault();
    };

    const onChange = (e) => {
      setBill({ ...bill, [e.target.name]: e.target.value });
    };

    //Update customer state
    const handleCustomer = (e) => {
      const { name, value } = e.target;
      setCustomer((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleProduct = (e) => {
      const { name, value } = e.target;
      setItem((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleClickProduct = (e) => {
      // e.preventDefault();
      setProducts((current) => [...current, item]);
      setEdithide([...edithide, item.pname])
      setItem(initialitem);
      props.showAlert("Item Added!", "success");
    };


    const handleRemoveItem = (e) => {
      e.preventDefault();
      const name = e.target.getAttribute("value");
      let newArr = products.filter((product) => product.pname !== name);
      let shownedited = edithide.filter((hid) => hid!==name);
      setEdithide(shownedited);
      setProducts(newArr);
      props.showAlert("Item Removed!", "success");
    };

    const CalculateTotal = (e) => {
      e.preventDefault();
      let value = cost - (cost * bill.discount) / 100;
      let final_value = value + (value * bill.gst) / 100;
      setTotal(final_value);
      setChange(0);
    };

    let cost = products.reduce((accumulator, { price, quantity }) => {
      return accumulator + price * quantity;
    }, 0);

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

    const handleClose = () => {setShow(false);setEdithide([]);};
    const handleShow = () => setShow(true);

    const updateBill= (billitem) => {
      setProducts(billitem.products);
      setCustomer(billitem.customer);
      setTotal(billitem.total);
      // return;
      setBill({
        id:billitem._id,
      total: billitem.total,
      customer: customer,
      discount: billitem.discount,
      amount: billitem.amount,
      gst: billitem.gst,
      products: billitem.products,
      billnumber:billitem.billnumber
      });
      billitem.products.forEach(element => {
        setEdithide( edithide=> [...edithide, element.pname])
      });
      handleShow();
    };

    // console.log(bill, "Active bill");

    const handleEdit =(e) =>{
      e.preventDefault();
      if(customer.name===""){customer.name=undefined};
      if(customer.phno===""){customer.phno=undefined};
      if(customer.address===""){customer.address=undefined};
      if(customer.gst===0){customer.gst=undefined};
      if(customer.email===""){customer.email=undefined};
      // return;
      editBill(
        bill.id,
        (bill.total=total),
        (bill.customer=customer),
        bill.discount,
        (bill.amount=cost),
        bill.gst,
        (bill.products=products)
      );
      setTotal(0);
      setEdithide([]);
      refClose.current.click();
    };

    useEffect(() => {
      getProducts();
      getBills();
      //eslint-disable-next-line
    }, []);

    //Display price of product when selected dynamically
    useEffect(() => {
      productlist.map((product) => {
        // if (product.pname === item.pname)
        return product.pname === item.pname
          ? setItem((prevState) => ({ ...prevState, price: product.price }))
          : "";
      });
    }, [item.pname, productlist]);

    // useEffect(() => {
    // { products.forEach(element => {
    //   setEdithide( edithide=> [...edithide, element.pname])
    //   console.log(element);});}
    // }, [update])
    // console.log(edithide, "hidden element")

    useEffect(() => {
      setChange(1);
      console.log(changecost, "cost change flag");
      if(bill.amount === cost)
      {setChange(0)};
      //eslint-disable-next-line
    },[cost]);

    useEffect(() => {
      if (item.pname !== "" && item.price !== "") {
        // && item.quantity!=="")
        handleClickProduct();
      }
      //eslint-disable-next-line
    }, [item]);
    return (
      <>
        <div className="container">
          {bills.length === 0 && "No Bills created"}
        </div>
        <div className="row my-3">
          <h2>Transactions</h2>
          <br />
          {bills.slice(0).reverse().map((bill) => {
            return (
              <Billitem  updateBill={updateBill} bill={bill} key={bill._id} showAlert={props.showAlert} />
            );
          })}
        </div>
        {/* <Button variant="outline-light" onClick={handleShow} ref={ref}>
        </Button> */}

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Bill No. : {bill.billnumber}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="my-3" onSubmit={handleSubmit}>
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
                    />
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
                  <div className="col-sm mb-3">
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
                  </div>
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
                    {productlist.map((products) => {return( (edithide.includes(products.pname)?null:<option key={products._id}>{products.pname}</option>));
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
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" ref={refClose} onClick={handleClose}>
              Close
            </Button>
              <OverlayTrigger overlay={(changecost===1?(<Tooltip id="tooltip-disabled">Amount Changed, Recalculate Total</Tooltip>):<span></span>)}>
                <span>
                <Button variant="primary" disabled={changecost===1} onClick={handleEdit}>
                  Save Changes
                </Button>
                </span>
              </OverlayTrigger>  
          </Modal.Footer>
        </Modal>
      </>
    );
  }

