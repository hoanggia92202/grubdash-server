function hasProperty(validPropertyName) {
  return function (req, res, next) {
    const propertyList = Object.keys(req.body.data);
    if (propertyList.includes(validPropertyName)) {
      return next();
    }
    next({ status: 400, message: `Dish must include a ${validPropertyName}` });
  };
}

function propertyNotEmpty(validPropertyName) {
  return function (req, res, next) {
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
  };
}

module.exports = {
  hasProperty,
  propertyNotEmpty,
};
