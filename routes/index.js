const userRoute = require('./user.route');
const productRoute = require('./product.route');
const categoryRoute = require('./category.route');
const addressRoute = require('./address.route');
const cartRoute = require('./cart.route');
const orderRoute = require('./order.route');
const blogRoute = require('./blog.route');
const revenue = require('./revenue.route');
const review = require('./review.route');

module.exports = (app) => {
  app.use('/product', productRoute);
  app.use('/user', userRoute);
 app.use('/categories', categoryRoute);
  app.use('/address', addressRoute);
 app.use('/cart', cartRoute);
 app.use('/order', orderRoute);
 app.use('/blog', blogRoute);
 app.use('/revenue', revenue);
 app.use('/review', review);

}
