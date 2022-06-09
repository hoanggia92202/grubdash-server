const router = require("express").Router();
const dishesController = require("./dishes.controller");

router.route("/").get(dishesController.list).post(dishesController.create);
router
  .route("/:dishId")
  .get(dishesController.read)
  .put(dishesController.update);

module.exports = router;
