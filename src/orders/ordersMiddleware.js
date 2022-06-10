const path = require("path");
const orders = require(path.resolve("src/data/orders-data"));

const hasOrder = (req, res, next) => {
  const { orderId } = req.params;
  const order = orders.find((order) => order.id === orderId);
  // set response locals orderId
  res.locals.orderId = orderId;
  // set response locals order
  res.locals.order = order;
  if (order) {
    return next();
  }
  return next({
    status: 404,
    message: `order ${res.locals.orderId} cannot be found.`,
  });
};

const isPending = (req, res, next) => {
  if (res.locals.order.status !== "pending") {
    return next({
      status: 400,
      message: "An order cannot be deleted unless it is pending",
    });
  }
  next();
};

const dishesIsAnArray = (req, res, next) => {
  const {
    data: { dishes },
  } = req.body;
  if (Array.isArray(dishes)) {
    return next();
  }
  next({ status: 400, message: "Order must include at least one dish" });
};

const dishNotEmpty = (req, res, next) => {
  const {
    data: { dishes },
  } = req.body;
  if (dishes.length === 0) {
    return next({
      status: 400,
      message: "Order must include at least one dish",
    });
  }
  next();
};

const quantityHasValue = (req, res, next) => {
  const {
    data: { dishes },
  } = req.body;
  for (let i = 0; i < dishes.length; i++) {
    if (!dishes[i]["quantity"]) {
      return next({
        status: 400,
        message: `Dish ${i} must have a quantity that is an integer greater than 0`,
      });
    }
  }
  next();
};

const quantityNaN = (req, res, next) => {
  const {
    data: { dishes },
  } = req.body;
  for (let i = 0; i < dishes.length; i++) {
    if (typeof dishes[i].quantity !== "number") {
      return next({
        status: 400,
        message: `Dish ${i} must have a quantity that is an integer greater than 0`,
      });
    }
  }
  next();
};

function idMismatch(req, res, next) {
  const {
    data: { id },
  } = req.body;
  if (id && res.locals.orderId !== id) {
    return next({
      status: 400,
      message: `Order id does not match route id. Order: ${id}, Route: ${res.locals.orderId}.`,
    });
  }
  next();
}

const statusIsInvalid = (req, res, next) => {
  const {
    data: { status },
  } = req.body;
  if (status === "invalid") {
    return next({
      status: 400,
      message:
        "Order must have a status of pending, preparing, out-for-delivery, delivered.",
    });
  }
  next();
};

module.exports = {
  hasOrder,
  isPending,
  dishesIsAnArray,
  dishNotEmpty,
  quantityHasValue,
  quantityNaN,
  idMismatch,
  statusIsInvalid,
};
