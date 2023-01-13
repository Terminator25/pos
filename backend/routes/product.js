const express = require("express");
const Product = require("../models/Product");
const Category = require("../models/Category");
const { ObjectId } = require("mongodb");
const router = express.Router();

const { body, validationResult } = require("express-validator");

// ROUTE1: get products list from : GET "/api/product/view"

router.get("/view", async (req, res) => {
  try {
    const products = await Product.find({deleted:false});
    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE2: add product from : POST "/api/product/add"

router.post(
  "/add",
  [
    body("pname", "Enter a valid product name").isLength({ min: 3 }),
    body("price", "Enter a valid price").isFloat({ min: 0 })
  ],
  async (req, res) => {
    try {
      //if there aree errors return bad request

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      //check whether product already exists
      let found = await Product.findOne({ pname: req.body.pname });
      if (found) {
        return res
          .status(400)
          .json({ error: "Sorry! a product with same name already exists" });
      }

      found = await Product.findOne({ sku: req.body.sku });
      if (found) {
        return res
          .status(400)
          .json({ error: "Sorry! a product with same sku already exists" });
      }

      found = await Product.findOne({ barcode: req.body.barcode });
      if (found) {
        return res
          .status(400)
          .json({ error: "Sorry! a product with same barcode already exists" });
      }

      try {
        found = await Category.findById(ObjectId(req.body.category));
        if (!found) {
          return res.status(400).json({ error: "Sorry! category not found" });
        }
      } catch (error) {
        return res.status(400).json({ error: "Sorry! category not found" });
      }

      const product = new Product({
        category: req.body.category,
        sku: req.body.sku,
        barcode: req.body.barcode,
        price: req.body.price,
        pname: req.body.pname,
        shortname: req.body.shortname,
        gstrate: req.body.gstrate
      });

      const savedproduct = await product.save();

      res.json(savedproduct);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE3: edit product from : PUT "/api/product/edit"
router.put("/edit/:id", async (req, res) => {
  try {
    const newprod = {};

    if (req.body.category) {
      try {
        let found = await Category.findById(ObjectId(req.body.category));
        if (!found) {
          return res.status(400).json({ error: "Sorry! category not found" });
        }
      } catch (error) {
        return res.status(400).json({ error: "Sorry! category not found" });
      }

      newprod.category = req.body.category;
    }

    if (req.body.sku) {
      let found = await Product.findOne({ sku: req.body.sku });
      // console.log(found._id)
      // console.log(ObjectId(req.params.id))
      // console.log()
      if (found && !found._id.equals(req.params.id)) {
        //console.log("found");
        return res
          .status(400)
          .json({ error: "Sorry! a product with same sku already exists" });
      }
      if (req.body.sku.length < 3) {
        return res.status(400).json({ error: "Enter a valid SKU" });
      }
      newprod.sku = req.body.sku;
    }

    if (req.body.barcode) {
      let found = await Product.findOne({ barcode: req.body.barcode });
      if (found && !found._id.equals(req.params.id)) {
        return res
          .status(400)
          .json({ error: "Sorry! a product with same barcode already exists" });
      }
      if (req.body.barcode.length < 3) {
        return res.status(400).json({ error: "Enter a valid barcode" });
      }
      newprod.barcode = req.body.barcode;
    }

    if (req.body.price) {
      newprod.price = req.body.price;
    }

    if (req.body.pname) {
      let found = await Product.findOne({ pname: req.body.pname });

      if (found && !found._id.equals(req.params.id)) {
        return res
          .status(400)
          .json({ error: "Sorry! a product with same name already exists" });
      }
      if (req.body.pname.length < 3) {
        return res.status(400).json({ error: "Enter a valid name" });
      }
      newprod.pname = req.body.pname;
    }

    if (req.body.shortname) {
      newprod.shortname = req.body.shortname;
    }

    newprod.gstrate=req.body.gstrate;

    let found = await Product.findById(req.params.id);
    if (!found) {
      return res.status(404).send("Not Found");
    }

    found = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: newprod },
      { new: true }
    );
    res.json({ found });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE4: delete category from : DELETE "/api/product/delete"
// router.delete("/delete/:id", async (req, res) => {
//   try {
//     try {
//       let found = await Product.findById(req.params.id);
//       if (!found) {
//         return res.status(404).send("Not Found");
//       }
//     } catch (error) {
//       return res.status(400).json({ error: "Wrong id" });
//     }

//     let found = await Product.findByIdAndDelete(req.params.id);
//     res.json({ Success: "Product has been deleted", product: found });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Internal Server Error");
//   }
// });
router.put("/delete/:id", async (req, res)=>{
  try{
    try{
      let found = await Product.findById(ObjectId(req.params.id));
      if(!found){
        return req.status(404).send("Not Found");
      }
    } catch(error){
      return res.status(400).json({error : "Wrong ID"});
    }
    let found = await Product.findByIdAndUpdate(req.params.id, {$set: {deleted:true}},{new:true});
    res.json({found});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

module.exports = router;
