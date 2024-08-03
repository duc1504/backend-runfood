const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    user: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'User',
        type: String,
        unique: true, // Đảm bảo mỗi user chỉ có một địa chỉ duy nhất
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    postalCode: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;