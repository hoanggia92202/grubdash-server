const path = require("path");
const dishes = require(path.resolve("src/data/dishes-data"));

function hasDish(req, res, next) {
  const { dishId } = req.params;
  const dish = dishes.find((dish) => dish.id === dishId);
  // set response locals dishId
  res.locals.dishId = dishId;
  // set response locals dish
  res.locals.dish = dish;
  if (dish) {
    return next();
  }
  next({ status: 404, message: `order ${dishId} cannot be found.` });
}

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

function hasRequestId(req, res, next) {
  const {
    data: { id },
  } = req.body;
  if (id && id !== res.locals.dishId) {
    return next({
      status: 400,
      message: `Dish id does not match route id. Dish: ${id}, Route: ${res.locals.dishId}`,
    });
  }
  next();
}

function checkDishId(req, res, next) {
  if (res.locals.dish) {
    return next();
  }
  next({ status: 404, message: `Dish does not exist: ${res.locals.dishId}.` });
}

module.exports = {
  hasDish,
  priceLessThanZero,
  priceNaN,
  hasRequestId,
  checkDishId,
};
