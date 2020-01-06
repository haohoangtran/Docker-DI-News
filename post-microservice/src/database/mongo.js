const MongoClient = require('mongodb')
const getMongoURL = (options) => {
  const url = options.servers
    .reduce((prev, cur) => prev + cur + ',', `mongodb://${options.user}:${options.pass}@`)
  // const str = `${url.substr(0, url.length - 1)}/${options.db}?replicaSet=rs0`
  return `${url.substr(0, url.length - 1)}/${options.db}`
}

const connect = (options, mediator) => {
  const { dbSettings } = options
  if (!dbSettings) throw new Error('missing dbSettings')
  MongoClient.connect(
    getMongoURL(dbSettings), { useUnifiedTopology: true }, (err, client) => {
      if (err) {
        mediator.emit('db.error', err)
      }
      const db = client.db(dbSettings.db)
      mediator.emit('db.ready', db)
    })
}

module.exports = { connect }
