import BillContext from "./BillContext";
import React, { useState } from "react";
import axios from "axios";

const BillState = (props)=>{
  
  const billsInitial = []
  
  const [bills, setBills] = useState(billsInitial)

  const [deletedbills, setDeleted] = useState([])
  
  const productsinitial = [];
  
  const [productlist, setProducts] = useState(productsinitial);

  const customersInitial = [];

  const [customers, setCustomers] = useState(customersInitial)
  
  const [result, setResult]=useState([]);

  const host="http://localhost:5000"
  
      //Get all bills from database
      const getBills = async ()=>{

        const response = await fetch(`${host}/api/bill/view`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const json  = await response.json();
    
        setBills(json)
      }

      const getDeletedBills = async ()=>{

        const response = await fetch(`${host}/api/bill/viewdeleted`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
          }
        });
        const json = await response.json();
        setDeleted(json)
      }
    
    
      //Add a bill to database
      const addBill = async (total, paymentmode, billnumber, customer, discount, amount, gstamount, products)=>{

        const response = await fetch(`${host}/api/bill/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({total, paymentmode, billnumber, customer, discount, amount, gstamount, products})
        });
        const json  = await response.json();
        setBills(bills.concat(json))
      }

      //Find all bills matching criteria
      // const findBills = async (phno, time, billnumber)=>{

      //   const response= await fetch(`${host}/api/bill/find`, {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'auth-token': localStorage.getItem('token')
      //     },
      //     body: JSON.stringify({phno, time, billnumber})
      //   });
      //   const json = await response.json();
      //   setResult(json);
      // }
      
      const findBills = (name, time, billnumber) => {
        const option = {
          method:'POST', headers:{
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
          },
          data: JSON.stringify({name,  time, billnumber}),
          url: `${host}/api/bill/find`
        };
        axios(option)
        .then((e) => {
          console.log("Search Result",e?.data);
          setResult(e?.data);
        })
        .catch(err => {
          console.log(err, 'err')
        })
      }

      //Edit bills that have been created
      const editBill = async (id, total, customer, discount, amount, gstamount, products) => {
        const response = await fetch(`${host}/api/bill/edit/${id}`,{
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({id, total, customer, discount, amount, gstamount, products })
        });
        const json = response.json();
        console.log(json)

        let billupdate = JSON.parse(JSON.stringify(bills));
        for(let index=0; index<billupdate.length;index++)
        {
          const element = billupdate[index];
          if(element._id === id)
          {
            billupdate[index].total = total;
            billupdate[index].customer = customer;
            billupdate[index].discount = discount;
            billupdate[index].amount = amount;
            billupdate[index].gstamount = gstamount;
            billupdate[index].products = products;
            break; 
          }
        }
        setBills(billupdate);
      }

      //Delete a bill

      // const deleteBill = async (id)=> {

      //   const response = await fetch(`${host}/api/bill/delete/${id}`,{
      //     method: 'PUT',
      //     headers:{
      //       'Content-Type': 'application/json',
      //       'auth-token': localStorage.getItem('token')
      //     }
      //   });
      //   const json = response.json();
      //   console.log(json);

        // let newbill = bills.filter((prod)=>{return prod._id!==id})
        // setBills(newbill);
      // }
      const deleteBill = (id) => {
        const option = {
          method: 'PUT', headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
          },
          url: `${host}/api/bill/delete/${id}`
        };
        axios(option)
        .then((e) => {
          console.log(e,'e112');
          if (e?.data?.found?._id) {
            getBills();
          }
        })
        .catch((err) => {
          console.log(err,'err');
        })
      }

      //Get list of products from database
      const getProducts = async ()=>{

        const response = await fetch(`${host}/api/product/view`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
          }
        });
        const json  = await response.json();
    
        setProducts(json)
    
      }
    
      // Get all customers from database
  
      const getCustomers = async ()=>{
  
        const response = await fetch(`${host}/api/customer/view`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
          }
        });
        const json  = await response.json();
    
        setCustomers(json)
    
      }
  
      // Add a customer

      const addCustomer = async (name,phno,email,address,gst)=>{

        const response = await fetch(`${host}/api/customer/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({name,gst,address,phno,email})
        });
        const json  = await response.json();
        setCustomers(customers.concat(json))
      }

      const restoreBill = (id) => {
        const option = {
          method: 'PUT', headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
          },
          url: `${host}/api/bill/restore/${id}`
        };
        axios(option)
        .then((e) => {
          console.log(e,'e112');
          if (e?.data?.found?._id) {
            getBills();
            getDeletedBills();
          }
        })
        .catch((err) => {
          console.log(err,'err');
        })
      }


    return (
        <BillContext.Provider value={{result, bills, deletedbills, productlist, customers, setBills, getBills, getDeletedBills, restoreBill, addBill, getProducts, getCustomers, addCustomer, findBills, editBill, deleteBill}}>
            {props.children}
        </BillContext.Provider>
    )
}

export default BillState;