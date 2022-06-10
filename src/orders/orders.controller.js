const path = require("path");

// import global middleware
const {
  hasProperty,
  propertyNotEmpty,
} = require("../GlobalMiddleware/globalMiddleware");

// import local middleware
const {
  dishesIsAnArray,
  dishNotEmpty,
  quantityHasValue,
  quantityNaN,
  isPending,
  hasOrder,
  idMismatch,
  statusIsInvalid,
} = require("./ordersMiddleware");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// list all orders
const list = (req, res) => {
  res.status(200).json({ data: orders });
};

// get an order
const read = (req, res, next) => {
  if (res.locals.order) {
    res.status(200).json({ data: res.locals.order });
  }
  next({ status: 404, message: "No matching order is found." });
};

// create an order
const create = (req, res) => {
  const iD = nextId();
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
const update = (req, res) => {
  const {
    data: { deliverTo, mobileNumber, status, dishes },
  } = req.body;
  res.locals.order.deliverTo = deliverTo;
  res.locals.order.mobileNumber = mobileNumber;
  res.locals.order.status = status;
  res.locals.order.dishes = [...dishes];
  res.status(200).json({ data: res.locals.order });
};

// delete an order
const destroy = (req, res) => {
  const orderIndex = orders.findIndex(
    (order) => order.id === res.locals.orderId
  );
  orders.splice(orderIndex, 1);
  res.sendStatus(204);
};

module.exports = {
  list,
  read: [hasOrder, read],
  create: [
    hasProperty("deliverTo"),
    hasProperty("mobileNumber"),
    propertyNotEmpty(["deliverTo", "mobileNumber"]),
    dishesIsAnArray,
    dishNotEmpty,
    quantityHasValue,
    quantityNaN,
    create,
  ],
  update: [
    hasOrder,
    idMismatch,
    hasProperty("deliverTo"),
    hasProperty("mobileNumber"),
    statusIsInvalid,
    propertyNotEmpty(["status", "deliverTo", "mobileNumber"]),
    dishesIsAnArray,
    dishNotEmpty,
    quantityHasValue,
    quantityNaN,
    update,
  ],
  destroy: [hasOrder, isPending, destroy],
};