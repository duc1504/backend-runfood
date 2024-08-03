const express = require("express");
const router = express.Router();
const Product = require("../models/product.model");

// Get single product
router.get("/detail/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    res.json({ status: true, data: product });
  } catch (error) {
    res.json({ status: false, error: error });
  }
});
// Add product
router.post("/add", async (req, res) => {
  console.log(req.body);
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
    description: req.body.description,
    category: req.body.category,
    stock: req.body.stock,
  });
  try {
    const savedProduct = await product.save();
    res.json({ status: true, data: savedProduct });
  } catch (error) {
    res.json({ status: false, error: error });
  }
});
// Delete product
router.delete("/delete/:productId", async (req, res) => {
  console.log(req.params.productId);
  try {
    const removedProduct = await Product.deleteOne({
      _id: req.params.productId,
    });
    res.json({ status: true, data: removedProduct });
  } catch (error) {
    res.json({ status: false, error: error });
  }
});
// Update product
router.put("/update/:productId", async (req, res) => {
  const { productId } = req.params;
  const { name, price, image, description, category, stock } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        price,
        image,
        description,
        category,
        stock,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ status: false, error: "Product not found" });
    }

    res.json({ status: true, data: updatedProduct });
  } catch (error) {
    res.status(400).json({ status: false, error: error.message });
  }
});
//get product by category
router.get("/category/:categoryId", async (req, res) => {
  const { categoryId } = req.params;
  try {
    const products = await Product.find({ category: categoryId }).sort({
      createdAt: -1,
    });
    res.json({ status: true, data: products });
  } catch (error) {
    res.json({ status: false, error: error });
  }
});

//search product
router.get("/search", async (req, res) => {
  const { name } = req.query;
  console.log(name);
  try {
    const products = await Product.find({
      name: { $regex: name, $options: "i" },
    });
    res.json({ status: true, data: products });
  } catch (error) {
    res.json({ status: false, error: error });
  }
});



// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });  
    res.json({ status: true, data: products });
  } catch (error) {
    res.json({ status: false, error: error });
  }
});

module.exports = router;
