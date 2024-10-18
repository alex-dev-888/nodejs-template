const { infoLogger, errorLogger } = require('../_helpers/logger')

module.exports = (req, res, next) => {
  infoLogger.info(
    `${req.requestId} - ${req.method} ${req.url} ${JSON.stringify(req.body)}`
  )

  const startTime = Date.now()
  let oldSend = res.send

  res.send = function (data) {
    res.body = data
    oldSend.apply(res, arguments)
  }

  res.on('finish', () => {
    const duration = Date.now() - startTime
    infoLogger.info(
      `${req.requestId} - ${res.statusCode} ${res.statusMessage}; ${
        res.get('Content-Length') || 0
      }b sent; Headers: ${JSON.stringify(
        res.getHeaders()
      )}; Duration: ${duration}ms; Body: ${JSON.stringify(res.body)}`
    )
  })
  next()
}
