const path = require("path");
const {
  hasProperty,
  propertyNotEmpty,
} = require("../AppMiddleware/midlleware");
const { includes } = require("../data/dishes-data");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
const list = (req, res, next) => {
  res.status(200).json({ data: orders });
};

const read = (req, res, next) => {
  const { orderId } = req.params;
  const order = orders.find((order) => order.id === orderId);
  if (order) {
    res.status(200).json({ data: order });
  }
  next({ status: 404, message: "No matching order is found." });
};

const create = async (req, res, next) => {
  const iD = await nextId();
  const {
    data: { deliverTo, mobileNumber, status, dishes },
  } = req.body;
  const newOrder = {
    id: iD,
    deliverTo,
    mobileNumber,
    status,
    dishes,
  };
  orders.push(newOrder);
  res.status(201).send({ data: newOrder });
};

const update = (req, res, next) => {
  const { orderId } = req.params;
  const {
    data: { deliverTo, mobileNumber, status, dishes },
  } = req.body;
  const order = orders.find((order) => order.id === orderId);
  order.deliverTo = deliverTo;
  order.mobileNumber = mobileNumber;
  order.status = status;
  order.dishes = [...dishes];
  res.status(200).json({ data: order });
};

const destroy = (req, res, next) => {
  const { orderId } = req.params;
  const order = orders.find((order) => order.id === orderId);

  const orderIndex = orders.findIndex((order) => order.id === orderId);
  orders.splice(orderIndex, 1);
  res.sendStatus(204);
};

const hasDishProperty = (req, res, next) => {
  const propertyList = Object.keys(req.body.data);
  if (propertyList.includes("dishes")) {
    //console.log("order", propertyList, propertyList.includes("dishes"));
    return next();
  }
  next({ status: 400, message: `Order must include a dish` });

  /*
const {
    data: { deliverTo, mobileNumber, status, dishes },
  } = req.body;
  if (dishes.length === 0) {
    return next({ status: 400, message: "Order must include a dish" });
  }
  next();
  */
};

const orderExist = (req, res, next) => {
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
    data: { deliverTo, mobileNumber, status, dishes },
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

function isStatusDelivered(req, res, next) {
  const { orderId } = req.params;
  const order = orders.find((order) => order.id === orderId);
  if (order.status === "delivered") {
    return next({
      status: 404,
      message: "A delivered order cannot be changed",
    });
  }
  next();
}

function idMismatch(req, res, next) {
  const { orderId } = req.params;
  const order = orders.find((order) => order.id === orderId);
  if (orderId !== order.id) {
    return next({
      status: 404,
      message: `Order id does not match route id. Order: ${order.id}, Route: ${orderId}.`,
    });
  }
  next();
}

module.exports = {
  list,
  read,
  create: [
    hasProperty("deliverTo"),
    hasProperty("mobileNumber"),

    //hasProperty("dishes"),
    //hasDishProperty,
    propertyNotEmpty(["deliverTo", "mobileNumber"]),
    dishIsAnArray,
    dishNotEmpty,
    hasQuantityProperty,
    create,
  ],
  update: [
    //isStatusDelivered,
    //idMismatch,
    hasProperty("deliverTo"),
    hasProperty("mobileNumber"),
    hasProperty("status"),
    propertyNotEmpty(["status", "deliverTo", "mobileNumber"]),

    dishIsAnArray,
    dishNotEmpty,
    hasQuantityProperty,

    hasDishProperty,
    // isStatusDelivered,
    update,
  ],
  destroy: [orderExist, isPending, destroy],
};