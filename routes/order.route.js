
const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');


// Route để lấy các đơn hàng của người dùng cụ thể
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        res.json({ status: true, data: orders });
    } catch (error) {
        res.json({ status: false, error: error });
    }
});



router.post('/checkout', async (req, res) => {
    const { products, customerPhone, customerAddress, note, userId, customerName,totalPrice } = req.body;

    try {
        // Kiểm tra tồn kho
        for (let item of products) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ status: false, message: `Product with ID ${item.productId} not found` });
            }
            // if (product.stock < item.quantity) {
            //     return res.status(400).json({ status: false, message: `Insufficient stock for product ${product.name}` });
            // }
        }

        // Tạo đơn hàng mới
        const newOrder = new Order({
            products: products,
            customerPhone: customerPhone,
            customerAddress: customerAddress,
            note: note,
            user: userId,
            totalPrice:totalPrice,
            customerName: customerName
        });

        // Lưu đơn hàng vào cơ sở dữ liệu
        const savedOrder = await newOrder.save();

        // Giảm tồn kho của sản phẩm
        for (let item of products) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.quantity }
            });
        }

        // Xóa giỏ hàng sau khi đặt hàng thành công
        await Cart.findOneAndDelete({ user: userId });

        // Trả về thông tin đơn hàng đã lưu
        res.status(201).json({ status: true, data: savedOrder });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Đã xảy ra lỗi khi lưu đơn hàng', error });
    }
});

// get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json({ status: true, data: orders });
    } catch (error) {
        res.json({ status: false, error: error });
    }
}); 

// Route để cập nhật trạng thái đơn hàng
router.put('/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        // Tìm và cập nhật trạng thái đơn hàng
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status: status },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ status: false, message: 'Đơn hàng không tồn tại' });
        }

        res.json({ status: true, data: updatedOrder });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Đã xảy ra lỗi khi cập nhật đơn hàng', error });
    }
});



module.exports = router;
