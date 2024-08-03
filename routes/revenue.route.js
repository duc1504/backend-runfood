const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');
const Product = require('../models/product.model');

// Route để lấy doanh thu hàng ngày
router.get('/daily', async (req, res) => {
    try {
        const dailyRevenue = await Order.aggregate([
            {
                $match: { status: 'success' } // Chỉ lấy các đơn hàng có trạng thái success
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalRevenue: { $sum: "$totalPrice" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]).sort({ _id: -1 });
        res.json({ status: true, data: dailyRevenue });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Đã xảy ra lỗi khi lấy doanh thu hàng ngày', error });
    }
});

// Route để lấy doanh thu hàng tháng
router.get('/monthly', async (req, res) => {
    try {
        const monthlyRevenue = await Order.aggregate([
            {
                $match: { status: 'success' } // Chỉ lấy các đơn hàng có trạng thái success
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    totalRevenue: { $sum: "$totalPrice" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]).sort({ _id: -1 });
        res.json({ status: true, data: monthlyRevenue });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Đã xảy ra lỗi khi lấy doanh thu hàng tháng', error });
    }
});


// API để thống kê doanh thu theo sản phẩm
router.get('/product', async (req, res) => {
    try {
        const orders = await Order.aggregate([
            { $match: { status: 'success' } }, // Lọc các đơn hàng có trạng thái success
            { $unwind: "$products" },
            {
                $group: {
                    _id: "$products.productId",
                    totalRevenue: { $sum: "$products.subTotal" }, // Sử dụng subTotal để tính tổng doanh thu
                    totalQuantity: { $sum: "$products.quantity" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { totalRevenue: -1 } }
        ]);

        // Gắn tên sản phẩm vào kết quả
        const results = await Promise.all(
            orders.map(async (order) => {
                const product = await Product.findById(order._id);
               
                return {
                    productId: order._id,
                    productName: product ? product.name : "Unknown", // Kiểm tra nếu sản phẩm không tồn tại
                    totalRevenue: order.totalRevenue,
                    totalQuantity: order.totalQuantity,
                    count: order.count
                };
            })
        );

        res.json({ status: true, data: results });
    } catch (error) {
        console.error('Error:', error); // Log lỗi để kiểm tra lỗi
        res.json({ status: false, error: error });
    }
});


module.exports = router;
