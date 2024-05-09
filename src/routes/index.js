const UserRouter = require("./UserRouter.js");
const CategoryRouter = require("./CategoriesRouter.js");
const ProductRouter = require("./ProductRouter.js");
const OrderRouter = require("./OrderRouter.js");

const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/category", CategoryRouter);
  app.use("/api/product", ProductRouter);
  app.use("/api/order", OrderRouter);
};

module.exports = routes;
