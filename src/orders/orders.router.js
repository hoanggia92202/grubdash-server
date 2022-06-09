const router = require("express").Router();
const ordersController = require("./orders.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/").get(ordersController.list).post(ordersController.create);
router
  .route("/:orderId")
  .get(ordersController.read)
  .put(ordersController.update)
  .delete(ordersController.destroy)
  .all(methodNotAllowed);

module.exports = router;
