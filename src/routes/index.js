const UserRouter = require("./UserRouter.js");
const CategoryRouter = require("./CategoriesRouter.js");

const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/category", CategoryRouter);
};

module.exports = routes;
