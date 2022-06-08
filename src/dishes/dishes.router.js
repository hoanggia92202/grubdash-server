const router = require("express").Router();
const dishesController = require("./dishes.controller");

// TODO: Implement the /dishes routes needed to make the tests pass
router.route("/").get(dishesController.list);
router.route("/:dishID");

module.exports = router;
