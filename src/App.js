import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from 'react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Products from "./components/Products/Products";
import Categories from "./components/Categories/Categories";
import Customers from "./components/Customers/Customers";
import Bills from "./components/Bills/Bills";
import Billhistory from "./components/Bills/Billhistory"
import Billdisplay from "./components/Bills/Billsdisplay"
import Login from "./components/User/Login"
import Register from "./components/User/Register"

import CategoryState from './context/categories/categoryState';
import CustomerState from './context/customers/customerState';
import ProductState from './context/products/productState';
import BillState from './context/bills/billState';
import PaymentState from "./context/payment/paymentState";
import { Alert } from "./components/alert";


function App() {
  const [alert, setAlert] = useState(null);

  //function to set alert in any page, passed as props
  const showAlert = (message, type)=>{
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
        setAlert(null);
    }, 1500);
}

  return (
    <>
      <PaymentState>  
      <CategoryState>
      <CustomerState>
      <ProductState>
      <BillState>
      <Router>
        <Navbar />
        <Alert alert={alert}/>
        
          <Routes>
            <Route path="register/" element={<Register showAlert={showAlert}/>}/>
            <Route path="login/" element={<Login showAlert={showAlert}/>}/>
            <Route path="/" element={<Home/>}/>
            <Route path="bill/*" element={<Bills showAlert={showAlert} />}/>
            <Route path="billhistory/*" element={<Billhistory showAlert={showAlert}/>}/>
            <Route path="billdisplay/*" element={<Billdisplay showAlert={showAlert} />}/>
            <Route path="customer/*" element={<Customers showAlert={showAlert} />}/>
            <Route path="product/*" element={<Products showAlert={showAlert} />}/>
            <Route path="category/*" element={<Categories showAlert={showAlert} />}/>
          </Routes>
      
      </Router>
      </BillState>
      </ProductState>
      </CustomerState>
      </CategoryState>
      </PaymentState>  
    </>
  );
}

export default App;
