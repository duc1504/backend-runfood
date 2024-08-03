const express = require('express')
const app = express()
var cookieParser = require('cookie-parser');

var indexRouter = require('./routes/index');
var bodyParser = require('body-parser')
var cors = require('cors');
var database = require('./config/database');
require('dotenv').config();
const port = process.env.PORT || 3000;
database();
require('./models/product.model');
require('./models/category.model');
require('./models/user.model');
require('./models/order.model');
require('./models/cart.model');
require('./models/address.model');
require('./models/cartdetail.model');
require('./models/blog.model');
require('./models/review.model');
app.use(express.json());
app.use(cookieParser());
app.use(cors());
indexRouter(app);
app.use(bodyParser.json());



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})