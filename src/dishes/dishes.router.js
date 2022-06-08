const router = require("express").Router();
const dishesController = require("./dishes.controller");

// TODO: Implement the /dishes routes needed to make the tests pass
router.route("/").get(dishesController.list).post(dishesController.create);
router.route("/:dishId").get(dishesController.read);

module.exports = router;
