const { infoLogger, errorLogger } = require('../_helpers/logger')

module.exports = (req, res, next) => {
  if (infoLogger) {
    infoLogger.info(
      `${req.requestId} - ${req.method} ${req.url} ${JSON.stringify(req.body)}`
    )
  }

  const startTime = Date.now()
  let oldSend = res.send

  res.send = function (data) {
    res.body = data
    oldSend.apply(res, arguments)
  }

  res.on('finish', () => {
    const duration = Date.now() - startTime
    if (infoLogger) {
      // Ghi log thông tin phản hồi
      infoLogger.info(
        `${req.requestId} - ${res.statusCode} ${res.statusMessage}; ` +
          `${res.get('Content-Length') || 0}b sent; Headers: ${JSON.stringify(
            res.getHeaders()
          )}; ` +
          `Duration: ${duration}ms; Body: ${
            typeof res.body === 'string' ? res.body : JSON.stringify(res.body)
          }`
      )
    }
  })

  next()
}
