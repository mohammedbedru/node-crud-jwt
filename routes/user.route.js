const { authJwt } = require("../middleware");
const branchController = require("../controllers/branch.controller");
const userController = require("../controllers/users.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/users/all", [authJwt.verifyToken, authJwt.isAdmin], userController.getAllUsers);

  app.get(
    "/api/users/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    userController.getOneUser
  );

  app.put(
    "/api/users/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    userController.updateUser
  );
  app.delete(
    "/api/branches/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    branchController.deleteBranch
  );
};
