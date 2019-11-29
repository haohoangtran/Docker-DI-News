const repo = (mongoClient, options) => {
  return require('./categoryRepo')(mongoClient, options)
}
const connect = (dbPool, options) => {
  if (!dbPool) throw new Error('Connect DB failed')
  return repo(dbPool, options)
}

module.exports = { connect }
