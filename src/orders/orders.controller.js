const path = require("path");
const {
  hasProperty,
  propertyNotEmpty,
} = require("../AppMiddleware/midlleware");

const {
  dishIsAnArray,
  dishNotEmpty,
  hasQuantityProperty,
  quantityNaN,
  hasDishProperty,
  isPending,
  hasOrder,
} = require("./ordersMiddleware");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// list all orders
const list = (req, res, next) => {
  res.status(200).json({ data: orders });
};

// get an order
const read = (req, res, next) => {
  const { orderId } = req.params;
  const order = orders.find((order) => order.id === orderId);
  if (order) {
    res.status(200).json({ data: order });
  }
  next({ status: 404, message: "No matching order is found." });
};

// create an order
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

// update an order
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

// delete an order
const destroy = (req, res, next) => {
  const { orderId } = req.params;
  const order = orders.find((order) => order.id === orderId);
  const orderIndex = orders.findIndex((order) => order.id === orderId);
  orders.splice(orderIndex, 1);
  res.sendStatus(204);
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
  const {
    data: { id },
  } = req.body;
  if (id && orderId !== id) {
    return next({
      status: 400,
      message: `Order id does not match route id. Order: ${id}, Route: ${orderId}.`,
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
    quantityNaN,
    hasQuantityProperty,
    create,
  ],
  update: [
    //isStatusDelivered,
    hasOrder,
    idMismatch,

    hasProperty("deliverTo"),
    hasProperty("mobileNumber"),
    hasProperty("status"),
    propertyNotEmpty(["status", "deliverTo", "mobileNumber"]),

    dishIsAnArray,
    dishNotEmpty,
    hasQuantityProperty,
    quantityNaN,
    hasDishProperty,
    // isStatusDelivered,
    update,
  ],
  destroy: [hasOrder, isPending, destroy],
};