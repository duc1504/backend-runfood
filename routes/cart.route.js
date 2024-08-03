const express = require("express");
const router = express.Router();
const Cart = require("../models/cart.model");
const mongoose = require("mongoose");
const Product = require('../models/product.model');
const CartDetail = require("../models/cartdetail.model");

// Route để thêm sản phẩm vào giỏ hàng
router.post("/add", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    // Tìm giỏ hàng của người dùng
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Nếu giỏ hàng chưa tồn tại, tạo mới giỏ hàng
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity: quantity }],
      });
      await cart.save();
    } else {
      // Kiểm tra sản phẩm đã tồn tại trong chi tiết giỏ hàng của giỏ hàng hay chưa
      const cartDetail = cart.items.find((item) => item.product == productId);
      if (cartDetail) {
        // Nếu sản phẩm đã tồn tại trong chi tiết giỏ hàng, cập nhật số lượng
        cartDetail.quantity += quantity;
      } else {
        // Nếu sản phẩm chưa tồn tại trong chi tiết giỏ hàng, thêm mới sản phẩm vào chi tiết giỏ hàng
        cart.items.push({ product: productId, quantity: quantity });
      }
      await cart.save();
    }

    // Trả về thông báo thành công
    res
      .status(200)
      .json({ status: true, message: "Sản phẩm đã được thêm vào giỏ hàng" });
  } catch (error) {
    res
      .status(500)
      .json({
        status: false,
        message: "Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng",
        error,
      });
  }
});

// Route để lấy sản phẩm đã thêm vào giỏ hàng và tính tổng tiền
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
      // Tìm giỏ hàng của người dùng và populate các sản phẩm
      const cart = await Cart.findOne({ user: userId }).populate({
          path: 'items.product',
          select: 'name price image', // Chọn các trường name, price và image từ sản phẩm
          model: Product
      });

      if (!cart) {
          return res.status(404).json({ status: false, message: 'Giỏ hàng không tồn tại' });
      }

      // Tính tổng tiền của các sản phẩm trong giỏ hàng
      let totalPrice = 0;
      const cartItems = cart.items.map(item => {
          // Kiểm tra xem sản phẩm có tồn tại hay không
          if (!item.product) {
              return null;
          }
          const subtotal = item.product.price * item.quantity;
          totalPrice += subtotal;
          return {
              product: {
                  _id: item.product._id,
                  name: item.product.name,
                  price: item.product.price,
                  image: item.product.image
              },
              quantity: item.quantity,
              subtotal: subtotal.toFixed(2)
          };
      }).filter(item => item !== null); // Lọc bỏ các sản phẩm null

      // Trả về thông tin giỏ hàng và tổng tiền
      res.status(200).json({ status: true, data: { items: cartItems, totalPrice: totalPrice.toFixed(2) } });
  } catch (error) {
      console.error('Error retrieving cart:', error);
      res.status(500).json({ status: false, message: 'Đã xảy ra lỗi khi lấy thông tin giỏ hàng', error });
  }
});

// Route để chỉnh sửa số lượng sản phẩm trong giỏ hàng
router.put("/update", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    // Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ status: false, message: 'Giỏ hàng không tồn tại' });
    }

    // Tìm sản phẩm trong chi tiết giỏ hàng
    const cartDetail = cart.items.find((item) => item.product.toString() === productId);

    if (!cartDetail) {
      return res.status(404).json({ status: false, message: 'Sản phẩm không có trong giỏ hàng' });
    }

    // Cập nhật số lượng sản phẩm
    cartDetail.quantity = quantity;

    // Tính tổng tiền của giỏ hàng
    let totalPrice = 0;
    cart.items.forEach(item => {
      const subtotal = item.product.price * item.quantity;
      totalPrice += subtotal;
    });

    await cart.save();

    // Trả về thông báo thành công và tổng tiền
    res.status(200).json({ status: true, message: 'Số lượng sản phẩm đã được cập nhật', totalPrice: totalPrice.toFixed(2) });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi khi cập nhật số lượng sản phẩm',
      error,
    });
  }
});
// Route để xóa sản phẩm khỏi giỏ hàng
router.delete("/remove", async (req, res) => {
  const { userId, productId } = req.body;

  try {
    // Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ status: false, message: 'Giỏ hàng không tồn tại' });
    }

    // Tìm sản phẩm trong giỏ hàng và xóa
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ status: false, message: 'Sản phẩm không tồn tại trong giỏ hàng' });
    }

    // Xóa sản phẩm khỏi giỏ hàng
    cart.items.splice(itemIndex, 1);
    await cart.save();

    // Trả về thông báo thành công
    res.status(200).json({ status: true, message: "Sản phẩm đã được xóa khỏi giỏ hàng" });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ status: false, message: 'Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng', error });
  }
});
// count 
router.get('/count/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ status: false, message: 'Giỏ hảng không tồn tại' });
    }
    const count = cart.items.length;  
    res.status(200).json({ status: true, count });
  } catch (error) {
    console.error('Error retrieving cart:', error);
    res.status(500).json({ status: false, message: 'Đã xảy ra lỗi khi lấy giờ hảng', error });
  }
});
module.exports = router;
