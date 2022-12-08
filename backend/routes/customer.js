const express = require("express");
const Customer = require("../models/Customer");
const router = express.Router();
const { ObjectId } = require("mongodb");
var validator = require("email-validator");

const { body, validationResult } = require("express-validator");

// ROUTE1: get customer list from : GET "/api/customer/view"
router.get("/view", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE2: add customer from : POST "/api/customer/add"

router.post(
  "/add",
  [
    body("name", "Enter a valid customer name").isLength({ min: 3 }),
    body("phno", "Enter a valid mobile number")
      .isLength({ min: 10 }),
  ],
  async (req, res) => {

    try {
      //console.log(req.body.email);

      //if there aree errors return bad request
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      //check whether customer already exists
      let found = await Customer.findOne({ phno: req.body.phno });
      if (found) {
        return res
          .status(400)
          .json({
            error: "Sorry! a customer with same mobile number already exists",
          });
      }

      const newcust = new Customer();

      if (req.body.email) {
        // console.log('hi')

        if (!validator.validate(req.body.email)) {
          return res.status(400).json({ error: "Invalid email id" });
        }

        newcust.email = req.body.email;
      }

      newcust.phno = req.body.phno;
      newcust.name = req.body.name;

      if (req.body.gst) {
        newcust.gst = req.body.gst;
      }

      if (req.body.address) {
        newcust.address = req.body.address;
      }

      const savedcustomer = await newcust.save();

      res.json(savedcustomer);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE3: edit customer from : PUT "/api/customer/edit"
router.put("/edit/:id", async (req, res) => {
  try {
    const newcust = {};

    if (req.body.phno) {
      let found = await Customer.findOne({ phno: req.body.phno });
      if (found && !found._id.equals(req.params.id)) {
        return res
          .status(400)
          .json({
            error: "Sorry! a customer with same mobile number already exists",
          });
      }
      if (req.body.phno.length < 10) {
        return res.status(400).json({ error: "Enter a valid mobile number" });
      }
      newcust.phno = req.body.phno;
    }

        if (req.body.name.length<3) {
            return res.status(400).json({ error: "Enter a valid customer name" });
        }
      newcust.name = req.body.name;
 
      newcust.gst = req.body.gst;


      if (!validator.validate(req.body.email) && req.body.email!=="") {
        return res.status(400).json({ error: "Invalid email id" });
    }
  
    newcust.email = req.body.email;
    
    newcust.address = req.body.address;

    let found = await Customer.findById(req.params.id);
    if (!found) {
      return res.status(404).send("Not Found");
    }

    found = await Customer.findByIdAndUpdate(
      req.params.id,
      { $set: newcust },
      { new: true }
    );
    res.json({ found });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE4: delete customer from : DELETE "/api/customer/delete"
router.delete("/delete/:id", async (req, res) => {
    try {
      try {
        let found = await Customer.findById(ObjectId(req.params.id));
        if (!found) {
          return res.status(404).send("Not Found");
        }
      } catch (error) {
        return res.status(400).json({ error: "Wrong id" });
      }
  
      let found = await Customer.findByIdAndDelete(req.params.id);
      res.json({ Success: "Customer has been deleted", Customer: found });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });

module.exports = router;
