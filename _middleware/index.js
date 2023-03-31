const uuidMiddleware = require('./uuid-middleware')
const loggingMiddleware = require('./logging-middleware')
const firstMiddleware = require('./first-middleware')
const errorHandler = require('./error-handler')

module.exports = {
  uuidMiddleware,
  loggingMiddleware,
  firstMiddleware,
  errorHandler,
}
