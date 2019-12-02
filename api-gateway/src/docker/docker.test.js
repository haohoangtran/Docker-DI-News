function test () {
  return new Promise((resolve, reject) => {
    resolve({
      1: {
        id: 1,
        route: '/api/v1/user',
        target: 'http://192.168.2.17:3001'
      },
      2: {
        id: 2,
        route: '/api/v1/post',
        target: 'http://192.168.2.17:3003'
      },
      3: {
        id: 3,
        route: '/api/v1/category',
        target: 'http://192.168.2.17:3002'
      }
    })
  })
}

module.exports = { test }
