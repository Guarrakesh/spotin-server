/**
 * @extends Error
 */
class ExtendableError extends Error {
  constructor({
                message, errors, status, isPublic, stack, internalCode
              }) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errors = errors;
    this.status = status;
    this.isPublic = isPublic;
    this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
    this.stack = stack;
    this.internalCode = internalCode;
    // Error.captureStackTrace(this, this.constructor.name);
  }
}

module.exports = ExtendableError;