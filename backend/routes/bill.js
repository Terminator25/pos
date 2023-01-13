const express = require("express");
const Bill = require("../models/bill");
const Customer = require("../models/bill");
const router = express.Router();
const { ObjectId } = require("mongodb");
const bill = require("../models/bill");


// ROUTE1: get bills list from : GET "/api/bill/view"

router.get("/view", async (req, res) => {
  try {
    const bills = await Bill.find({deleted:false});
    res.json(bills);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE2: add bills from : POST "/api/bill/add"

router.post("/add", async (req, res) => {
  try {
    const bill = new Bill();

    bill.billnumber = req.body.billnumber;
    bill.total = req.body.total;
    bill.paymentmode = req.body.paymentmode;
    bill.discount = req.body.discount;
    bill.amount = req.body.amount;
    bill.gstamount = req.body.gstamount;
    let currentTime = new Date();
    let ISToffSet = 330; //IST is 5:30; i.e. 60*5+30 = 330 in minutes 
    let offset= ISToffSet*60*1000;
    // var ISTTime = new Date(date.getTime()+offset);
    bill.time = new Date(currentTime.getTime()+offset);

    bill.customer = req.body.customer; 
  //   bill.customer = new Customer(); 

  //  //console.log(bill)
  //   if (req.body.customer.phno) {
  //     bill.customer.phno = req.body.customer.phno;
  //   }
  
  //   if (req.body.customer.name) {
  //     bill.customer.name = req.body.customer.name;
  //   }

  //   if (req.body.customer.gst) {
  //     bill.customer.gst = req.body.customer.gst;
  //   }

  //   if (req.body.customer.address) {
  //     bill.customer.address = req.body.customer.address;
  //   }

  //   if (req.body.customer.email) {
  //     bill.customer.email = req.body.customer.email;
  //   }

  //   if (req.body.customer.email) {
  //     bill.customer.email = req.body.customer.email;
  //   }

  //   if (req.body.customer.email) {
  //     bill.customer.email = req.body.customer.email;
  //   }

  //   if (req.body.customer.pin) {
  //     bill.customer.pin = req.body.customer.pin;
  //   }

  //   if (req.body.customer.state) {
  //     bill.customer.state = req.body.customer.state;
  //   }

  //   if (req.body.customer.entity) {
  //     bill.customer.entity = req.body.customer.entity;
  //   }

    bill.products = req.body.products;
    

    const savedbill = await bill.save();

    res.json(savedbill);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE3: get bills matching search criteria
// router.get("/find", async(req, res)=>{
//   try{
//     let search;
//     let tomorrow = new Date(req.body.time)
//     tomorrow.setDate(tomorrow.getDate() + 1);
//     if(req.body.billnumber!==undefined)
//     {search=await Bill.findOne({billnumber:req.body.billnumber})}
//     else if(req.body.customer!==undefined && req.body.time!==undefined)
//     {search=await Bill.find({$and:[{'customer.phno':req.body.customer.phno}, {time:{$gte:new Date(req.body.time), $lt:new Date(tomorrow)}}]})}
//     else if(req.body.customer!==undefined)
//     {search=await Bill.find({'customer.phno':req.body.customer.phno})}
//     else
//     {search=await Bill.find({time:{$gte:new Date(req.body.time), $lt:new Date(tomorrow)}})}
    
//     // ({$or:[{time:req.body.time},{'customer.phno':req.body.customer.phno}]})
//     // {$and:[{'customer.phno':req.body.customer.phno}, {time:req.body.time}]},
//     res.json(search);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Internal Server Error");
//   }
// })

router.post("/find", async(req, res)=>{
  // try{
  //   let time=req.body.time;
  //   let billnumber=req.body.billnumber;
  //   let phno=req.body.phno;
  //   let tomorrow;
  //   tomorrow = new Date(time);
  //   tomorrow.setDate(tomorrow.getDate()+1);
  //   let search;
  //   if(billnumber!=='')
  //   {search=await Bill.find({billnumber:billnumber})}
  //   else if(phno!=='' && time!=='')
  //   {search=await Bill.find({$and:[{'customer.phno':phno}, {time:{$gte:new Date(time), $lt:tomorrow}}]})}
  //   // search=await Bill.find({$or:[{$and:[{'customer.phno':phno}, {time:{$gte:new Date(time), $lt:tomorrow}}]},{'customer.phno':phno},{time:{$gte:time, $lt:tomorrow}}]})
  //   else if(phno!=='')
  //   {search=await Bill.find({'customer.phno':phno})}
  //   else
  //   {search=await Bill.find({time:{$gte:time, $lt:tomorrow}})}
  //   res.json(search);
  // }catch (error) {
  //       console.error(error.message);
  //       res.status(500).send("Internal Server Error");
  //     }
    try{
    let search;
    let tomorrow = new Date(req.body.time)
    tomorrow.setDate(tomorrow.getDate() + 1);
    if(req.body.billnumber!==""&& req.body.phno==="" && req.body.time==="")
    {search=await Bill.find({billnumber:req.body.billnumber})}
    else if(req.body.phno!=="" && req.body.time!==""&& req.body.billnumber==="")
    {search=await Bill.find({$and:[{'customer.phno':req.body.phno}, {time:{$gte:new Date(req.body.time), $lt:new Date(tomorrow)}}]})}
    else if(req.body.phno!=="" && req.body.time==="" && req.body.billnumber==="")
    {search=await Bill.find({'customer.phno':req.body.phno})}
    else
    {search=await Bill.find({time:{$gte:new Date(req.body.time), $lt:new Date(tomorrow)}})}
    
    // ({$or:[{time:req.body.time},{'customer.phno':req.body.customer.phno}]})
    // {$and:[{'customer.phno':req.body.customer.phno}, {time:req.body.time}]},
    res.json(search);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

//Route 4: Edit certain bill details
router.put("/edit/:id", async (req, res) => {
  try{
    const billupdate = {
      customer:"",
      total: "",
      discount: 0,
      amount: "",
      gstamount: 0,
      products: []
    };
  
    billupdate.customer = req.body.customer;
    billupdate.total = req.body.total;
    billupdate.discount = req.body.discount;
    billupdate.amount = req.body.amount;
    billupdate.gstamount = req.body.gstamount;
    billupdate.products = req.body.products;
    
    found = await Bill.findById(req.params.id);
    if (!found){
      return res.status(404).send("No Bill Found");
    }

    found = await Bill.findByIdAndUpdate( req.params.id, {$set: billupdate}, {new:true});

    res.json({found});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

// ROUTE4: delete customer from : DELETE "/api/bill/delete/id"
// router.delete("/delete/:id", async (req, res) => {
//   try {
//     try {
//       let found = await Bill.findById(ObjectId(req.params.id));
//       if (!found) {
//         return res.status(404).send("Not Found");
//       }
//     } catch (error) {
//       return res.status(400).json({ error: "Wrong id" });
//     }

//     let found = await Bill.findByIdAndDelete(req.params.id);
//     res.json({ Success: "Customer has been deleted", Customer: found });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Internal Server Error");
//   }
// });

// ROUTE4: edit bill deleted field to hide value
router.put("/delete/:id", async (req, res)=>{
  try{
    try{
      let found = await Bill.findById(ObjectId(req.params.id));
      if(!found){
        return req.status(404).send("Not Found");
      }
    } catch(error){
      return res.status(400).json({error : "Wrong ID"});
    }
    let found = await Bill.findByIdAndUpdate(req.params.id, {$set: {deleted:true}},{new:true});
    res.json({found});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

module.exports = router;
