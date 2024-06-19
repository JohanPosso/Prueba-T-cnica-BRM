/**
 * Returns a middleware function that wraps the given function in a Promise and catches any errors that occur.
 *
 * @param {Function} fn - The function to be wrapped.
 * @returns {Function} - The middleware function.
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = { catchAsync };
