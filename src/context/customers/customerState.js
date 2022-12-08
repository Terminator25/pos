import CustomerContext from "./CustomerContext";
import React, { useState } from "react";

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

      const addCustomer = async (name,phno,email,address,gst)=>{

        const response = await fetch(`${host}/api/customer/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
          },
          body: JSON.stringify({name,gst,address,phno,email})
        });
        const json  = await response.json();
        setCustomers(customers.concat(json))
      }

      
  // Edit a customer
  const editCustomer = async (id,name,phno,email,address,gst)=>{

    const response = await fetch(`${host}/api/customer/edit/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({id,name,phno,email,address,gst})
    });
    const json  = response.json();
    console.log(json)

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
        break;
      }
    }

    setCustomers(newcust);
    
  }

  // Delete a customer

  const deleteCustomer = async (id)=>{

    const response = await fetch(`${host}/api/customer/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
    });
    const json  = response.json();
    console.log(json);

    let newcust = customers.filter((prod)=>{return prod._id!==id})
    setCustomers(newcust)
  }
    
    return (
        <CustomerContext.Provider value={{customers, getCustomer, addCustomer, editCustomer, deleteCustomer}}>
            {props.children}
        </CustomerContext.Provider>
    )
}

export default CustomerState;