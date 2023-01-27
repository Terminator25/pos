import React, { useContext, useEffect, useState, useRef } from "react";
import BillContext from "../../context/bills/BillContext";
import Billitem from "./Billitem";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';  

export default function Billresult(props) {
    const context = useContext(BillContext);
    const { productlist, getProducts, editBill, getCustomers, customers } = context;

    let { bills } = props;

    const [searchresults, setResults]=useState([]);
    
    //Initial values stored in item state
    let initialitem = { pname: "", price: "", quantity: 1, gstrate:""};

    const [item, setItem] = useState(initialitem);
    
    //State for creating a product array
    const [products, setProducts] = useState([]);

    //Create a customer state
    // const [customer, setCustomer] = useState({ name: "", gst: "", address: "", phno: "", email: "", state: "", pin: "", entity: "" });

    //State to check cost change
    const [changecost, setChange] = useState(0)

    //State to calculate CGST, IGST, SGST
    const [gsttotal, setGST] = useState(0);
    
    //State to update bill details
    const [bill, setBill] = useState({
      id: "",
      total: "",
      customer: null,
      discount: 0,
      amount: "",
      gstamount: 0,
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

    const removebill = (bill) =>
    {
      let newArray = searchresults.filter((element)=>element._id!==bill._id);
      setResults(newArray)
      bills=[];
    }; 
    
    const handleSubmit = (e) => {
      e.preventDefault();
    };

    const onChange = (e) => {
      setBill({ ...bill, [e.target.name]: e.target.value });
    };

    //Update customer state
    // const handleCustomer = (e) => {
    //   const { name, value } = e.target;
    //   setCustomer((prevState) => ({ ...prevState, [name]: value }));
    // };

    const handleProduct = (e) => {
      const { name, value } = e.target;
      setItem((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleClickProduct = (e) => {
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
      let final_value = cost - (cost * bill.discount) / 100;
      setTotal(final_value);
      let tax = gstvalue - (gstvalue*bill.discount) /100;
      setGST(tax.toFixed(2));
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
      // setCustomer(billitem.customer);
      setTotal(billitem.total);
      setGST(billitem.gstamount);
      setBill({
        id:billitem._id,
      total: billitem.total,
      customer: billitem.customer,
      discount: billitem.discount,
      amount: billitem.amount,
      gstamount: billitem.gstamount,
      products: billitem.products,
      billnumber:billitem.billnumber
      });
      billitem.products.forEach(element => {
        setEdithide( edithide=> [...edithide, element.pname])
      });
      handleShow();
      // ref.current.click();
    };

    // console.log(bill, "Active bill");

    const handleEdit =(e) =>{
      e.preventDefault();
      editBill(
        bill.id,
        (bill.total=total),
        bill.customer || null,
        bill.discount,
        (bill.amount=cost),
        bill.gstamount,
        (bill.products=products)
      );
      setTotal(0);
      setEdithide([]);
      refClose.current.click();
    };

    useEffect(() => {
      setResults(bills)
      //eslint-disable-next-line
    },[bills]);

    useEffect(() => {
      getProducts();
      getCustomers();
      //eslint-disable-next-line
    }, []);

    //Display price of product when selected dynamically
    useEffect(() => {
      productlist.map((product) => {
        // if (product.pname === item.pname)
        return product.pname === item.pname
          ? setItem((prevState) => ({ ...prevState, price: product.price, gstrate: product.gstrate }))
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
    
    let gstvalue = products.reduce((accumulator, { price, quantity, gstrate }) => {
      return accumulator + price * quantity*(gstrate/100);
    }, 0);

    return (
      <>
        <div className="container">
            <h4>Search Results</h4>
            {/* <h5>{bills.length === 0 && "No Bills Matching  Search Criteria"}</h5>
            <br/> */}
        </div>
        <div className="row my-3">
          {bills.length===0?(<h5>No Bills Matching  Search Criteria</h5>):searchresults.map((bill) => {
            return (
              <Billitem 
              removebill={removebill} 
              updateBill={updateBill} bill={bill} key={bill._id} showAlert={props.showAlert} />
            );
          })}
          {/* {searchresults.map((bill) => {
            return (
              <Billitem 
              removebill={removebill} 
              updateBill={updateBill} bill={bill} key={bill._id} showAlert={props.showAlert} />
            );
          })} */}
        </div>
        {/* <Button variant="outline-light" onClick={handleShow} ref={ref}>
        </Button> */}

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Bill No. : {bill.billnumber}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="my-3" onSubmit={handleSubmit}>
              {/* <div className="row">
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
              </div> */}
                            <div className="row">
                <h4>Customer Details</h4>
                <div className="cols-sm mb-3">
                <select
                    id="customer"
                    name="customer"
                    className="form-select"
                    aria-label="Customer Name"
                    onChange={onChange}
                  >
                    {/* selected={product.category === "sel" ? "selected" : ''} */}
                    <option key="sel" value={null} selected={bill.customer === "sel" ? "selected" : null}>
                      Customer Name
                    </option>
                    {customers.map((user) => {
                      return (
                        <option key={user._id} value={user._id}>
                          {user.name}
                        </option>
                      );
                    })}
                    <option value="" >Remove Customer Details</option>
                  </select>
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
                {/* {customer.state!=="Haryana" & customer.entity==="Company"?
              (<span className="mx-4">
                <strong>IGST : </strong>
                {gsttotal}
                </span>): */}
                <span className="mx-4">
                <strong>CGST : </strong>
                {gsttotal/2}
                <br/>
                <strong>SGST : </strong>
                {gsttotal/2}
              </span>
              {/* )} */}
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

























// import React from "react";
// import Billitem from "./Billitem";

// export default function Billresult(props) {

//     const { bills } = props;
//     return(
//             <div className="container">          
//             <div className="row my-3">
//                 <h4>Search Results</h4>
//                 <h5>{bills.length ===0 && "No Bills Matching  Search Criteria"}</h5>
//                 <br/>
//                 {
//                     bills.map((bill) => {
//                         return(
//                             <Billitem
//                             bill={bill}
//                             key={bill._id}
//                             showAlert={props.showAlert}/>
//                         )
//                     })
//                 }
//             </div>
//             </div>
//     )
// }