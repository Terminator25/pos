import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BillContext from "../../context/bills/BillContext";
import Billresult from "./Billresult";

export default function Billsearch(props) {
    const state = useLocation();

    const context = useContext(BillContext);
    
    const { result, findBills }=context;

    const [bill, setBill] = useState({
        billnumber:"",
        phno:"",
        time:""
    });

    const [initialized, setIni] = useState(0)
    
    const onChange = (e) => {
        setBill({ ...bill, [e.target.name]: e.target.value });
    };
    
    useEffect(()=>{
        if(state.state!=='')
        {setBill({...bill, phno:state.state});
        state.state='';}
        //eslint-disable-next-line
    },[]);
    
    const onClick = (e) =>{

        findBills(
            bill.phno || "",
            bill.time,
            bill.billnumber
            );
        props.showAlert("Searching", "success");
        setBill({
            billnumber:"",
            phno:"",
            time:""
          });
        setIni(1);
    }
    
    return(
        <>
        <div className="container">
        <h2>Search Query</h2>
      
        <form>
            <div className="row">
                <div className="col-sm-3">
                    <label>Phone Number</label>
                    <input
                    type="text"
                    className="form-control"
                    name="phno"
                    onChange={onChange}
                    value={bill.phno}
                    placeholder="Phone Number"
                    />
                </div>
                <div className="col-sm-3">
                    <label>Date of Bill</label>
                    <input
                    type="date"
                    className="form-control"
                    name="time"
                    onChange={onChange}
                    value={bill.time}
                    />
                </div>
                <div className="col-sm-3">
                    <label>Bill Number</label>
                    <input
                    type="text"
                    className="form-control"
                    name="billnumber"
                    onChange={onChange}
                    value={bill.billnumber}
                    placeholder="Bill Number"
                    />
                </div>
                <div className="col-sm-3 my-4">
                    <button id='search' disabled={bill.billnumber==='' & bill.phno==='' & bill.time===''} className="bg-primary rounded text-white" type="submit" onClick={onClick}>Submit</button>
                </div>
            </div>
        </form>
        
        <div className="row">
            {initialized===0 ? (<h4>Search results will appear here...</h4>):(<Billresult bills={result} showAlert={props.showAlert} />) }
        </div>
        </div>
        </>
    )
}