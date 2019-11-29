const { EventEmitter } = require('events')
const mediator = new EventEmitter()
const { connect, ObjectId } = require('./database')
const { config } = require('./config')
const { initDI } = require('./di')
const server = require('./server')
const repo = require('./repo')
const logger = require('./logger')
const models = require('./models')

console.log('-- Category Service')
console.log('Connecting to repository...')

process.on('uncaughtException', err => {
  console.error('Unhandled Exception', err)
})

connect(config, mediator)
mediator.on('db.err', err => {
  console.log(err)
})
mediator.on('db.ready', db => {
  console.log('Connected repository, init DI')
  const { dbSettings, serverSettings, errorCode, serverHelper } = config
  initDI({
    dbSettings,
    serverSettings,
    errorCode,
    logger,
    repo: repo.connect(db, { ...config, ObjectId }),
    models,
    serverHelper
  }, mediator)
})

mediator.on('di.ready', container => {
  console.log('di ready, start app')
  server.start(container).then(app => {
    console.log('Server start at port ', app.address().port)
  })
})
