module.exports = function (mongoClient, options) {
  const { ObjectId } = options

  function createIndex () {
    mongoClient.createCollection('categories', (error) => {
      if (error) {
        return console.error(error)
      }
      mongoClient.collection('categories').createIndex('name', { unique: true })
    })
  }

  createIndex()
  const addCategory = (category) => {
    return new Promise((resolve, reject) => {
      category.createBy = new ObjectId(category.createBy)
      mongoClient.collection('categories').insertOne(category, (err, data) => {
        if (err) reject(new Error(err))
        else {
          const { result, ops } = data
          if (result.ok) {
            resolve(ops)
          } else {
            reject(new Error('Không thể thêm category.'))
          }
        }
      })
    })
  }
  const getCategoryById = (id) => {
    return new Promise((resolve, reject) => {
      mongoClient.collection('categories').findOne({ _id: new ObjectId(id) }, (err, data) => {
        err ? reject(new Error(err)) : resolve(data)
      })
    })
  }
  const deleteCategory = (id) => {
    return new Promise((resolve, reject) => {
      mongoClient.collection('categories').remove({ _id: new ObjectId(id) }, (err) => {
        err ? reject(new Error(err)) : resolve('ok')
      })
    })
  }
  const updateCategory = (category) => {
    const { id, iduser, name, displayName } = category
    return new Promise((resolve, reject) => {
      mongoClient.collection('categories').updateOne({ _id: new ObjectId(id), createBy: iduser }, {
        $set: {
          name,
          displayName
        }
      }, (err, data) => {
        err ? reject(new Error(err)) : resolve(data)
      })
    })
  }
  return { deleteCategory, getCategoryById, addCategory, updateCategory }
}
