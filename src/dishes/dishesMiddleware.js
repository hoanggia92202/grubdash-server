const path = require("path");
const dishes = require(path.resolve("src/data/dishes-data"));

function priceLessThanZero(req, res, next) {
  const {
    data: { price },
  } = req.body;
  if (price < 0) {
    return next({
      status: 400,
      message: `Dish must have a price that is an integer greater than 0`,
    });
  }
  next();
}

function priceNaN(req, res, next) {
  const {
    data: { price },
  } = req.body;
  if (typeof price !== "number") {
    return next({
      status: 400,
      message: `Dish must have a price that is an integer greater than 0`,
    });
  }
  next();
}

function checkDishId(req, res, next) {
  const { dishId } = req.params;
  const dish = dishes.find((dish) => dish.id === dishId);
  if (dish) {
    return next();
  }
  next({ status: 404, message: `Dish does not exist: ${dishId}.` });
}

function hasRequestId(req, res, next) {
  const { dishId } = req.params;
  const {
    data: { id },
  } = req.body;
  if (id && id !== dishId) {
    return next({
      status: 400,
      message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
    });
  }
  next();
}

module.exports = {
  priceLessThanZero,
  priceNaN,
  checkDishId,
  hasRequestId,
};
