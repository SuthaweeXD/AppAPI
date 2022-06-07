module.exports = (app) => {
  const router = require('express').Router()
  const { verifytoken } = require('../models/middleware.models.js')
  const { create,findAll,findOne,update,deleteOne,login } = require('../controllers/order_detail.controller')

  router.post('/', create)

  router.get('/',findAll)

  router.post('/login',login)

  router.get('/:id',findOne)

//   router.post('/number',number)

  router.put('/:id', update)

  router.delete('/:id', deleteOne)

  //เซ็ต PREFIX
  app.use(process.env.PREFIX + '/order_detail', router)
}
