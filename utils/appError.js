class AppError extends Error {
  /**
   * Constructs a new AppError object with the given status and message.
   *
   * @param {string} status - The status of the error.
   * @param {string} message - The error message.
   */
  constructor(status, message) {
    super(message);
    this.status = status;
    this.statusCode = this.status.startsWith("4") ? 400 : 500;
  }
}

module.exports = { AppError };
