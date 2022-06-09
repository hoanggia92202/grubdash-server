const router = require("express").Router();
const ordersController = require("./orders.controller");

// TODO: Implement the /orders routes needed to make the tests pass
router.route("/").get(ordersController.list).post(ordersController.create);
router
  .route("/:orderId")
  .get(ordersController.read)
  .put(ordersController.update)
  .delete(ordersController.destroy);

module.exports = router;
