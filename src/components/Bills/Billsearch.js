import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BillContext from "../../context/bills/BillContext";
import Billresult from "./Billresult";
import { DateRange } from 'react-date-range';

export default function Billsearch(props) {
    const state = useLocation();

    const context = useContext(BillContext);
    
    const { result, findBills, getCustomers, customers }=context;

    const [bill, setBill] = useState({
        name:"",
        billnumber:"",
        time:""
    });

    const [dates, setDate] = useState([
        {
          startDate: new Date(),
          endDate: null,
          key: 'selection'
        }
      ])

    const [disable, setDisable] = useState(true)
    const [customer, setCustomer] = useState("");
    const [initialized, setIni] = useState(0)
    
    const onChange = (e) => {
        setBill({ ...bill, [e.target.name]: e.target.value });
        setDisable(false);
    };
    
    const setRange = (e)=>{
        setDate([e.selection]);
        setDisable(false);
    };

    const onChangeCustomer = (e) => {
        setCustomer(e.target.value);
        setDisable(false);
    }
 
    useEffect(()=>{
        // if(state.state!=='')
        // {setBill({...bill, phno:state.state});
        // state.state='';}

        getCustomers();
        //eslint-disable-next-line
    },[]);
    
    useEffect(()=>{
        customers.map((user)=>{
            return (user.name===customer)?(
                setBill({...bill, name:user._id})
                ):null
        })
        //eslint-disable-next-line
    },[customer])

    const onClick = (e) =>{
        
        customers.map((user)=>{
            return (user.name===customer)?(
                setBill({...bill, name:user._id})
                ):null
        })
    
        findBills(
            bill.name||"",
            bill.time=dates,
            bill.billnumber
            );
        props.showAlert("Searching", "success");

        setBill({
            name:"",
            billnumber:"",
            time:""
          });
        setCustomer("");
        setIni(1);
        setDisable(true);
    }
    
    console.log("Bill.Time", bill.time);
    console.log("DateRange", dates)

    return(
        <>
        <div className="container">
        <h2>Search Query</h2>


        <form>
            <div className="row">
                <div className="col-sm-3">
                    <label>Name</label>
                    <input
                    type="text"
                    className="form-control"
                    name="name"
                    onChange={onChangeCustomer}
                    value={customer}
                    placeholder="Customer Name"
                    />
                </div>
                {/* <div className="col-sm-3">
                    <label>Phone Number</label>
                    <input
                    type="text"
                    className="form-control"
                    name="phno"
                    onChange={onChange}
                    value={bill.phno}
                    placeholder="Phone Number"
                    />
                </div> */}
                <div className="col-sm-4">
                    <label>Date of Bill</label>
                    {/* <input
                    type="date"
                    className="form-control"
                    name="time"
                    onChange={onChange}
                    value={bill.time}
                    /> */}
                    <DateRange
                        editableDateInputs={true}
                        // onChange={item => setDate([item.selection])}
                        onChange={setRange}
                        moveRangeOnFirstSelection={false}
                        ranges={dates}
                        dateDisplayFormat="dd-MM-yyyy"
                        // showMonthArrow={false}
                        // showSelectionPreview={false}
                        // showDateDisplay={false}
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
                <div className="col-sm-2 my-4">
                    <button id='search' disabled={disable} className="bg-primary rounded text-white" type="submit" onClick={onClick}>Submit</button>
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