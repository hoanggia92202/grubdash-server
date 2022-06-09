// validation middleware
const path = require("path");
const {
  hasProperty,
  propertyNotEmpty,
} = require("../AppMiddleware/midlleware");
const {
  priceLessThanZero,
  priceNaN,
  checkDishId,
  hasRequestId,
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
  const { dishId } = req.params;
  const dish = dishes.find((dish) => dish.id === dishId);
  res.status(200).json({ data: dish });
};

// update a dish
const update = (req, res, next) => {
  const {
    data: { name, description, image_url, price },
  } = req.body;
  const { dishId } = req.params;
  const dish = dishes.find((dish) => dish.id === dishId);
  dish.name = name;
  dish.description = description;
  dish.image_url = image_url;
  dish.price = price;
  res.status(200).json({ data: dish });
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
  read: [checkDishId, read],
  update: [
    hasProperty("name"),
    hasProperty("description"),
    hasProperty("price"),
    //propertyNotEmpty,
    propertyNotEmpty(["name", "description", "price", "image_url"]),
    priceLessThanZero,
    priceNaN,
    //hasProperty("image_url"),
    //checkDishId,
    hasRequestId,
    update,
  ],
};
