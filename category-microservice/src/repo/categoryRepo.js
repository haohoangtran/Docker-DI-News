module.exports = function (mongoClient, options) {
  const { ObjectId } = options

  function createIndex () {
    mongoClient.collection('categories').createIndex('name', { unique: true })
  }

  createIndex()
  const addCategory = (catagory) => {
    return new Promise((resolve, reject) => {
      catagory.createBy = new ObjectId(catagory.createBy)
      mongoClient.collection('categories').insertOne(catagory, (err, data) => {
        err ? reject(err) : resolve(data)
      })
    })
  }
  const getCategoryById = (id) => {
    return new Promise((resolve, reject) => {
      mongoClient.collection('categories').findOne({ _id: new ObjectId(id) }, (err, data) => {
        err ? reject(err) : resolve(data)
      })
    })
  }
  const deleteCategory = (id) => {
    return new Promise((resolve, reject) => {
      mongoClient.collection('categories').remove({ _id: new ObjectId(id) }, (err, data) => {
        err ? reject(err) : resolve(data)
      })
    })
  }
  return { deleteCategory, getCategoryById, addCategory }
}
