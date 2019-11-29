function e (msg) {
  console.error('ERR', msg)
}

function d (msg) {
  console.debug('DEBUG', msg)
}

module.exports = { d, e }
