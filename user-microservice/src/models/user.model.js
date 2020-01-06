const userSchema = (joi) => ({
  username: joi.string().regex(/^[a-zA-Z0-9'-]+$/i).required(),
  name: joi.string().min(1).max(16).required(),
  isAdmin: joi.boolean().required(),
  password: joi.string().min(8).required(),
  repeatPassword: joi.string().min(8).required().valid(joi.ref('password')),
  createTime: joi.string().empty().default(new Date())
})

module.exports = userSchema
