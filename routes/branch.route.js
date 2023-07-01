const { authJwt } = require("../middleware");
const branchController = require("../controllers/branch.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/branches/allBranches", [authJwt.verifyToken], branchController.getAllBranches);

  app.get(
    "/api/branches/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    branchController.getOneBranch
  );

  app.post(
    "/api/branches/addBranch",
    [authJwt.verifyToken, authJwt.isAdmin],
    branchController.addBranch
  );

  app.put(
    "/api/branches/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    branchController.updateBranch
  );
  app.delete(
    "/api/branches/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    branchController.deleteBranch
  );
};
