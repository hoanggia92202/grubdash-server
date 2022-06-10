const path = require("path");

// import global middleware
const {
  hasProperty,
  propertyNotEmpty,
} = require("../GlobalMiddleware/globalMiddleware");

// import local middleware
const {
  priceLessThanZero,
  priceNaN,
  checkDishId,
  hasRequestId,
  hasDish,
} = require("./dishesMiddleware");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// list all dishes
const list = (req, res) => {
  res.json({ data: dishes });
};

// create a dish
const create = async (req, res) => {
  const iD = await nextId();
  const {
    data: { name, description, image_url, price },
  } = req.body;
  const newDish = {
    id: iD,
    name,
    description,
    image_url,
    price,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
};

// get a dish
const read = (req, res, next) => {
  res.status(200).json({ data: res.locals.dish });
};

// update a dish
const update = (req, res, next) => {
  const {
    data: { name, description, image_url, price },
  } = req.body;
  res.locals.dish.name = name;
  res.locals.dish.description = description;
  res.locals.dish.image_url = image_url;
  res.locals.dish.price = price;
  res.status(200).json({ data: res.locals.dish });
};

module.exports = {
  list,
  create: [
    hasProperty("name"),
    hasProperty("description"),
    hasProperty("price"),
    hasProperty("image_url"),
    propertyNotEmpty(["name", "description", "price", "image_url"]),
    priceLessThanZero,
    create,
  ],
  read: [hasDish, checkDishId, read],
  update: [
    hasDish,
    hasProperty("name"),
    hasProperty("description"),
    hasProperty("price"),
    propertyNotEmpty(["name", "description", "price", "image_url"]),
    priceLessThanZero,
    priceNaN,
    hasRequestId,
    update,
  ],
};
