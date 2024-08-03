// routes/review.route.js
const express = require("express");
const router = express.Router();
const Review = require("../models/review.model");
const Order = require("../models/order.model");

router.post("/", async (req, res) => {
    const { userId, productId, rating, comment } = req.body;
  
    try {
      // Tìm tất cả các đơn hàng thành công của người dùng
      const orders = await Order.find({
        user: userId,
        "products.productId": productId,
        status: "success",
      });
  
      // Kiểm tra xem sản phẩm có nằm trong các đơn hàng không
      if (orders.length === 0) {
        return res.status(400).json({
          message: "Bạn chưa mua sản phẩm này, nên không thể đánh giá.",
        });
      }
  
      // Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
      const existingReview = await Review.findOne({
        user: userId,
        product: productId,
      });
      if (existingReview) {
        return res.status(400).json({
            status: false,
          message: "Bạn đã đánh giá sản phẩm này rồi.",
        });
      }
  
      // Tạo đánh giá mới
      const review = new Review({
        user: userId,
        product: productId,
        rating,
        comment,
      });
      await review.save();
      res.status(201).json({ status: true, message: "Đánh giá đã được thêm thành công." });
    } catch (err) {
      console.error(err);
      res.status(500).json({status: false, message: "Lỗi khi thêm đánh giá." });
    }
  });
// API để lấy tất cả các đánh giá cho một sản phẩm
router.get("/:productId", async (req, res) => {
  const { productId } = req.params;
 
  try {
    const reviews = await Review.find({ product: productId }).populate("user", "name");
    res.status(200).json({status : true, data: reviews});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách đánh giá." });
  }
});

module.exports = router;
