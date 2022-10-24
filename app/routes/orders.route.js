module.exports = (app) => {
  const router = require('express').Router()
  const { create,findAll,findOne,update,deleteOne,login, updateStatus,findOrder, paymentOrder } = require('../controllers/orders.controller')
  const multer  = require('multer')
  const upload = multer()
  
  router.post('/', create)

  router.get('/',findAll)

  router.post('/login',login)

  router.get('/f/:id',findOne)

//   router.post('/number',number)

  router.put('/:id', update)

  router.put('/payment/:id',upload.single('photo'), paymentOrder)


  router.delete('/:id', deleteOne)
  router.put('/status/:id', updateStatus)

  router.get('/forder',findOrder)

  //เซ็ต PREFIX
  app.use(process.env.PREFIX + '/orders', router)
}
