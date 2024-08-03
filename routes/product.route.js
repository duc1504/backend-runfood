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

// Get products by category with pagination
router.get("/category/:categoryId", async (req, res) => {
  const { categoryId } = req.params;
  // Lấy số trang và số lượng sản phẩm mỗi trang từ query string
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    // Lấy tất cả sản phẩm theo danh mục với phân trang
    if (categoryId === "all") {
      const products = await Product.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      const totalProducts = await Product.countDocuments(); // Đếm tổng số được sản phẩm
      res.json({
        status: true,
        data: products,
        totalProducts,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
      });
    }
    const products = await Product.find({ category: categoryId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalProducts = await Product.countDocuments({
      category: categoryId,
    }); // Đếm tổng số sản phẩm theo danh mục

    res.json({
      status: true,
      data: products,
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
    });
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

// Get all products with pagination
router.get("/", async (req, res) => {
  try {
    // Lấy số trang và số lượng sản phẩm mỗi trang từ query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Lấy tất cả sản phẩm với phân trang
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalProducts = await Product.countDocuments(); // Đếm tổng số sản phẩm

    res.json({
      status: true,
      data: products,
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    res.json({ status: false, error: error });
  }
});

module.exports = router;
