 const mongoose = require('mongoose');
 require('dotenv').config()
 const MONGO_ATLAS_URL = process.env.MONGO_ATLAS_URL;
 module.exports = () => {
try {
    mongoose.connect(MONGO_ATLAS_URL);
    console.log('Database connected');
} catch (error) {
    console.log(error);
}
}

