const express = require("express");
const Category = require("../models/Category");
const Product = require("../models/Product");

const router = express.Router();
const { body, validationResult } = require("express-validator");


// ROUTE1: get category list from : GET "/api/category/view"

router.get('/view', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE2: add category from : POST "/api/category/add"

router.post(
  '/add',
  [body('name', 'Enter a valid category name').isLength({ min: 3 })],
  async (req, res) => {
    try {
      //if there aree errors return bad request

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      //check wheteher category already exists
      let found = await Category.findOne({ name: req.body.name });
      if (found) {
        return res.status(400).json({ error: "Sorry! a category with same name already exists" });
      }
      
      const category = new Category({
        name:req.body.name,
      });

      const savedcategory = await category.save();

      res.json(savedcategory);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE3: edit category from : PUT "/api/category/edit"
router.patch('/edit/:id',
[body('name', 'Enter a valid category name').isLength({ min: 3 })],
 async (req, res) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const newcat = {};
        newcat.name = req.body.name;

        let found = await Category.findById(req.params.id);
        if (!found) {
          return res.status(404).send("Not Found");
        }

              //check wheteher category already exists
      found = await Category.findOne({ name: req.body.name });
      if (found) {
        return res.status(400).json({ error: "Sorry! a category with same name already exists" });
      }

        found = await Category.findByIdAndUpdate(req.params.id,{$set: newcat},{new:true});
        res.send('success');

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });

  // ROUTE4: delete category from : DELETE "/api/category/delete"
router.delete('/delete/:id',
 async (req, res) => {
    try {

        let found = await Category.findById(req.params.id);
        if (!found) {
          return res.status(404).send("Not Found");
        }

      found = await Product.findOne({ category: req.params.id });
      if (found) {
        return res.status(400).json({ error: "Sorry! products in this category exists" });
      }

        found = await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({"Success":"Category has been deleted", category:found})

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });

module.exports = router;
