require('rootpath')()
const express = require('express')
const https = require('https')
const fs = require('fs')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

require('dotenv').config({ path: `env/.env.${process.env.NODE_ENV}` })

// import middleware function
const middleware = require('_middleware')

// import logger
const {
  infoLogger,
  errorLogger,
  httpLoggerMiddleware,
  errorLoggerMiddleware,
} = require('_helpers/logger')
const { httpLogger } = require('./_helpers/logger')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// allow cors requests from any origin and with credentials
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
)

// use middleware functions
app.use(middleware.uuidMiddleware)
app.use(middleware.loggingMiddleware)
app.use(middleware.firstMiddleware)

// use middleware logger functions
if (httpLoggerMiddleware) {
  app.use(httpLoggerMiddleware)
}
if (errorLoggerMiddleware) {
  app.use(errorLoggerMiddleware)
}

// Route handler
app.get('/', (req, res) => {
  if (infoLogger) {
    infoLogger.info(`${req.requestId} - This is a route /`)
  }
  res.send('Hello World!')
})

// Thêm route để test logging
app.get('/hello', (req, res) => {
  if (infoLogger) {
    infoLogger.info(`${req.requestId} - This is a route /hello`)
  }
  res.send('Hello!')
})

app.get('/boom', (req, res, next) => {
  // throw new Error('Boom Exception!')
  throw 'Boom Exception'
})

// global error handler
app.use(middleware.errorHandler)

const options = {
  key: fs.readFileSync(process.env.KEY),
  cert: fs.readFileSync(process.env.CERT),
}

https.createServer(options, app).listen(process.env.PORT, () => {
  console.log('Server listening on port ' + process.env.PORT)
})

// // start server
// app.listen(process.env.PORT, () => {
//   console.log('Server listening on port ' + process.env.PORT)
// })
