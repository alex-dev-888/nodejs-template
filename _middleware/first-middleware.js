const { infoLogger, errorLogger } = require('../_helpers/logger')

module.exports = (req, res, next) => {
  infoLogger.info(`${req.requestId} - First Middleware`)
  next()
}
