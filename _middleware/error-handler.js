const { infoLogger, errorLogger } = require('../_helpers/logger')

module.exports = errorHandler
function errorHandler(err, req, res, next) {
  switch (true) {
    case typeof err === 'string':
      // custom application error
      const is404 = err.toLowerCase().endsWith('not found')
      const statusCode = is404 ? 404 : 400
      errorLogger.error(`${req.requestId} - ${err}`)
      return res.status(statusCode).json({ message: err })

    case err.name === 'ValidationError':
      // mongoose validation error
      errorLogger.error(`${req.requestId} - ${err.message}`)
      return res.status(400).json({ message: err.message })

    case err.name === 'UnauthorizedError':
      // jwt authentication error
      errorLogger.error(`${req.requestId} - ${'Unauthorized'}`)
      return res.status(401).json({ message: 'Unauthorized' })

    default:
      errorLogger.error(`${req.requestId} - ${err.message}`)
      return res.status(500).json({ message: err.message })
  }
}
