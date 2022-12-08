import PaymentContext from "./PaymentContext";
import React,{useState} from "react";
import axios from "axios";

const PaymentState = (props) => {

    const host = "http://localhost:5000"
    const [tstoken, setTstoken]= useState();
    // console.log('tstoken',tstoken);
    //Initiate Transaction via paytm
    // const initialize = async (amount, orderId) =>{
    //     const response= await fetch(`${host}/api/payment/initiate`,{
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({amount,orderId})
    //       });
    //     const json = await response.json();
    //     console.log("transaction details", json);
    //     setTstoken(json);
    //     localStorage.setItem('transaction',json);
    // }

    const initialize = (amount, orderId) => {
      const option = {
        method:'POST', headers:{
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({amount,orderId}),
        url: `${host}/api/payment/initiate`
      };
      axios(option)
      .then((e) => {
        console.log(e.data, 'token');
        setTstoken(e?.data);
      })
      .catch(err => {
        console.log(err,'err');
      })
    }

    const update = (amount, orderId, txntoken) => {
      const option = {
        method:'POST', headers:{
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({amount, orderId, txntoken}),
        url: `${host}/api/payment/update`
      };
      axios(option)
      .catch(err => {
        console.log(err,'err');
      })
    }
    
  return(
    <PaymentContext.Provider value={{tstoken, update, setTstoken, initialize}}>
      {props.children}
    </PaymentContext.Provider>
  )  
}

export default PaymentState;