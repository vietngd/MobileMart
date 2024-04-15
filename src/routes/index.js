const UserRouter = require("./UserRouter.js");

const routes = (app) => {
  app.use("/api/user", UserRouter);
};

module.exports = routes;
