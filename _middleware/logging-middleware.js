const { infoLogger, errorLogger } = require('../_helpers/logger')

module.exports = (req, res, next) => {
  infoLogger.info(
    `${req.requestId} - ${req.method} ${req.url} ${JSON.stringify(req.body)}`
  )
  res.on('finish', () => {
    infoLogger.info(
      `${req.requestId} - ${res.statusCode} ${res.statusMessage}; ${
        res.get('Content-Length') || 0
      }b sent`
    )
  })
  next()
}
