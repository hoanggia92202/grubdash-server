const path = require("path");
const orders = require(path.resolve("src/data/orders-data"));

const hasDishProperty = (req, res, next) => {
  const propertyList = Object.keys(req.body.data);
  if (propertyList.includes("dishes")) {
    return next();
  }
  next({ status: 400, message: `Order must include a dish` });
};

const hasOrder = (req, res, next) => {
  const { orderId } = req.params;
  const order = orders.find((order) => order.id === orderId);
  if (!order) {
    return next({ status: 404, message: `order ${orderId} cannot be found.` });
  }
  next();
};

const isPending = (req, res, next) => {
  const { orderId } = req.params;
  const order = orders.find((order) => order.id === orderId);
  if (order.status !== "pending") {
    return next({
      status: 400,
      message: "An order cannot be deleted unless it is pending",
    });
  }
  next();
};

const dishIsAnArray = (req, res, next) => {
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

const hasQuantityProperty = (req, res, next) => {
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

module.exports = {
  hasDishProperty,
  hasOrder,
  isPending,
  dishIsAnArray,
  dishNotEmpty,
  hasQuantityProperty,
  quantityNaN,
};
