import CustomerContext from "./CustomerContext";
import React, { useState } from "react";
import axios from "axios";

const CustomerState = (props)=>{

  const host = "http://localhost:5000"

  const customersInitial = [];
  const [customers, setCustomers] = useState(customersInitial)

    // Get all customers

    const getCustomer = async ()=>{

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

      const addCustomer = async (name,phno,email,address,gst, state, pin, entity)=>{

        const response = await fetch(`${host}/api/customer/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
          },
          body: JSON.stringify({name,gst,address,phno,email, state, pin, entity})
        });
        const json  = await response.json();
        setCustomers(customers.concat(json))
      }

      
  // Edit a customer
  const editCustomer = async (id ,name ,phno ,email ,address ,gst, state, pin, entity)=>{

    const response = await fetch(`${host}/api/customer/edit/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({id,name,phno,email,address,gst, state, pin, entity})
    });
    const json  = response.json();
    console.log('updated value', json)

    let newcust= JSON.parse(JSON.stringify(customers))
    for(let index=0;index<newcust.length;index++)
    {
      const element = newcust[index];
      if(element._id===id)
      {
        newcust[index].name = name;
        newcust[index].phno = phno;
        newcust[index].email = email;
        newcust[index].address = address;
        newcust[index].gst = gst;
        newcust[index].state = state;
        newcust[index].pin = pin;
        newcust[index].entity = entity;
        break;
      }
    }

    setCustomers(newcust);
    getCustomer();
  }

  // Delete a customer

  // const deleteCustomer = async (id)=>{

  //   const response = await fetch(`${host}/api/customer/delete/${id}`, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'auth-token': localStorage.getItem('token')
  //     },
  //   });
  //   const json  = response.json();
  //   console.log("value received",json);
  //   if(json.found._id)
  //   {alert("working");}

  //   // let newcust = customers.filter((prod)=>{return prod._id!==id})
  //   // setCustomers(newcust)
  // }

  const deleteCustomer = (id) => {
    const option = {
      method: 'PUT', headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      url: `${host}/api/customer/delete/${id}`
    };
    axios(option)
    .then((e) => {
      console.log(e,'e112');
      if (e?.data?.found?._id) {
        getCustomer();
      }
    })
    .catch((err) => {
      console.log(err,'err');
    })
  }
    
    return (
        <CustomerContext.Provider value={{customers, getCustomer, addCustomer, editCustomer, deleteCustomer}}>
            {props.children}
        </CustomerContext.Provider>
    )
}

export default CustomerState;