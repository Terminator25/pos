const express = require("express");
const Bill = require("../models/Bill");
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

router.get("/viewdeleted", async(req, res)=>{
  try {
    const products = await Product.find({deleted:true})
    res.json(products); 
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error")
  }
})


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
        market_price: req.body.market_price,
        pname: req.body.pname,
        shortname: req.body.shortname,
        gstrate: req.body.gstrate,
        quantity: req.body.quantity
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
      // try {
      //   let found = await Category.findById(ObjectId(req.body.category));
      //   if (!found) {
      //     return res.status(400).json({ error: "Sorry! category not found" });
      //   }
      // } catch (error) {
      //   return res.status(400).json({ error: "Sorry! category not found" });
      // }

      newprod.category = req.body.category;
    }

    if (req.body.sku) {
      // let found = await Product.findOne({ sku: req.body.sku });
      // // console.log(found._id)
      // // console.log(ObjectId(req.params.id))
      // // console.log()
      // if (found && !found._id.equals(req.params.id)) {
      //   //console.log("found");
      //   return res
      //     .status(400)
      //     .json({ error: "Sorry! a product with same sku already exists" });
      // }
      // if (req.body.sku.length < 3) {
      //   return res.status(400).json({ error: "Enter a valid SKU" });
      // }
      newprod.sku = req.body.sku;
    }

    if (req.body.barcode) {
      // let found = await Product.findOne({ barcode: req.body.barcode });
      // if (found && !found._id.equals(req.params.id)) {
      //   return res
      //     .status(400)
      //     .json({ error: "Sorry! a product with same barcode already exists" });
      // }
      // if (req.body.barcode.length < 3) {
      //   return res.status(400).json({ error: "Enter a valid barcode" });
      // }
      newprod.barcode = req.body.barcode;
    }

    if (req.body.price) {
      newprod.price = req.body.price;
    }

    if (req.body.market_price) {
      newprod.market_price = req.body.market_price;
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

router.put("/restore/:id", async (req, res)=>{
  try{
    try{
      let found = await Product.findById(ObjectId(req.params.id));
      if(!found){
        return req.status(404).send("Not Found");
      }
    } catch(error){
      return res.status(400).json({error : "Wrong ID"});
    }
    let found = await Product.findByIdAndUpdate(req.params.id, {$set: {deleted:false}},{new:true});
    res.json({found});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

//route 5: insert additional objects through array of objects
router.post("/addmultiple",async(req, res)=>{
  try{
    const savedproduct=Product.insertMany(req.body)
    console.log(savedproduct);
  }catch(err){
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

//route 6: delete multiple entriesx`
router.put("/deletemultiple",async(req, res)=>{
  try{
    const removed = await Product.updateMany({"_id":req.body} ,{$set: {deleted:true} }, {new:true} );
    res.json(removed);
  }catch(err){
    console.log(err.message);
    res.status(500).send("Internal Server Error");
  }
})

//route 7: update inventory of product
router.put("/inventory/:id", async(req, res)=>{
  try{
    try {
      let found = await Product.findById(ObjectId(req.params.id));
      if(!found){
        return req.status(404).send("Not Found");
      }
    } catch (error) {
      return res.status(400).json({error : "Wrong ID"});
    }

    const value=req.body.quantity;

    let found = await Product.findByIdAndUpdate(req.params.id, {$set: {quantity:value}},{new:true});
    res.json({found});
  }catch(err){
    console.log(err.message);
    res.status(500).send("Internal Server Error")
  }
})

//route 8: search for a product
router.post("/search", async(req, res)=>{
  
  try{
    let search = await Product.findOne({pname:req.body.pname, deleted:false})
    res.json(search);
  } catch(error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error")
  }
})

router.put("/deleteall", async (req, res)=>{
  try{
    let found = await Product.updateMany({quantity : 100});
    res.json({found});
  } catch (error){
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

router.put("/monthlyupdate", async (req,res)=>{
  try{ 
    const today = new Date();
    const endOfMonth = new Date(today.getFullYear(), today.getMonth()+1, 1);
    const beginningofMonth = new Date(today.getFullYear(), today.getMonth(), 1); 
    let productarray = await Bill.find({time:{$gte:beginningofMonth, $lt:endOfMonth}},{"products":1, "_id":0});
    let product_quantity_used={}
    productarray.forEach(item=>item.products.forEach(product => 
      {
        if(product_quantity_used.hasOwnProperty(product.pname))
          {product_quantity_used[product.pname] += product.quantity}
        else 
          {product_quantity_used[product.pname] = product.quantity} 
      }))
    let products= await Product.find({});
    products.forEach(async product=>{
    if (product_quantity_used.hasOwnProperty(product.pname))
      {await Product.findByIdAndUpdate(product._id, {$set:{quantity:product.quantity-product_quantity_used[product.pname]}, new:true})}
    })
  } catch(error){
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

router.get("/test", async(req, res)=>{
  try{
    const today = new Date();
    const endOfMonth = new Date(today.getFullYear(), today.getMonth()+1, 1);
    const beginningofMonth = new Date(today.getFullYear(), today.getMonth(), 1); 
    let productarray = await Bill.find({time:{$gte:beginningofMonth, $lt:endOfMonth}},{"products":1, "_id":0});
    res.json(productarray);
  }catch(error){
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})