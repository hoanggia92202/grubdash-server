const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// middleware handler
function hasProperty(validPropertyName){
    return function(req, res, next){
        const propertyList = Object.keys(req.body.data);
        if(propertyList.includes(validPropertyName)){
            return next();
        }
        next({status: 400, message: `Dish must include a ${validPropertyName}`});
    }
}

function propertyNotEmpty(req, res, next) {
  const validPropertyName = ["name", "description", "price", "image_url"];
  const propertyList = req.body.data;
  validPropertyName.forEach((propName) => {
    if (!propertyList[propName]) {
      return next({
        status: 400,
        message: `Dish must include a ${propName}`,
      });
    }
  });
  next();
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

function checkDishId(req, res, next) {
  const { dishId } = req.params;
  const dish = dishes.find((dish) => dish.id === dishId);
  if (dish) {
    return next();
  }
  next({ status: 404, message: "No matching dish is found." });
}

// TODO: Implement the /dishes handlers needed to make the tests pass
const list = (req, res) => {
  res.json({ data: dishes });
};

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

function read(req, res, next) {
  const { dishId } = req.params;
  const dish = dishes.find((dish) => dish.id === dishId);
  res.status(200).json({ data: dish });
}

module.exports = {
  list,
  create: [
    hasProperty("name"),
    hasProperty("description"),
    hasProperty("price"),
    hasProperty("image_url"),
    propertyNotEmpty,
    priceLessThanZero,
    create,
  ],
  read: [checkDishId, read],
};