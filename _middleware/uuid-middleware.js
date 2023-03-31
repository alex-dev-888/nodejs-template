const uuid = require('uuid')

module.exports = (req, res, next) => {
  req.requestId = uuid.v4()
  next()
}
