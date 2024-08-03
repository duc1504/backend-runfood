const mongoose = require('mongoose');

const cartDetailSchema = new mongoose.Schema({
    cart_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true,
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1, // Số lượng mặc định khi thêm vào giỏ hàng
    },
    // Nếu bạn cần lưu thêm thông tin giá sản phẩm hoặc các thông tin khác,
    // bạn có thể mở rộng schema ở đây.
});

const CartDetail = mongoose.model('CartDetail', cartDetailSchema);

module.exports = CartDetail;
