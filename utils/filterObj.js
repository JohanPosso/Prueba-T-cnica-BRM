/**
 * Filters an object to only include the specified fields.
 *
 * @param {Object} obj - The object to filter.
 * @param {...string} allowedFields - The fields to include in the filtered object.
 * @return {Object} The filtered object.
 */
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

module.exports = { filterObj };
