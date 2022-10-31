module.exports = (app) => {
  const router = require('express').Router()
  const { create, findAll, findOne, reportOrder, reportAllorder, update, deleteOne, updateStatus, findOrder, paymentOrder, findPayment, reportOrderAccept } = require('../controllers/orders.controller')
  const multer  = require('multer')
  const upload = multer()
  
  router.post('/', create)

  router.get('/',findAll)


  router.get('/f1/:id',findOne)

  router.get('/reportOrder/:startDate/:endDate',reportOrder)
  router.get('/reportAllOrder/:status/:startDate/:endDate',reportAllorder)
//   router.post('/number',number)
router.get('/reportOrderAccept/:startDate/:endDate',reportOrderAccept)
  router.put('/:id', update)

  router.put('/payment/:id',upload.single('photo'), paymentOrder)


  router.delete('/:id', deleteOne)
  router.put('/status/:id', updateStatus)

  router.get('/forder',findOrder)
  router.get('/findpayment',findPayment)

  //เซ็ต PREFIX
  app.use(process.env.PREFIX + '/orders', router)
}
