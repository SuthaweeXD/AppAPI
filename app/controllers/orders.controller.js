const validate_req = require('../models/validate_req.models')
const mysql = require('../models/mysql.models')
const { verifyingHash, hashPassword } = require('../models/hashing.models')
const { signtoken } = require('../models/middleware.models')
const {uploadImage} = require('../models/suprabase')

exports.create = async (req, res) => {
  //ดึงข้อมูลจาก request
  const { odate, ogetdate, total,small,big,roll,opayment,userid } = req.body
  //ตรวจสอบความถูกต้อง request
  if (validate_req(req, res, [ userid])) return
  //คำสั่ง SQL
  let sql = `INSERT INTO orders SET ?`
  //ข้อมูลที่จะใส่ ชื่อฟิล : ข้อมูล
  let data = {
    order_date: odate,
    order_getdate: ogetdate,
    order_total: total,
    order_small: small,
    order_big: big,
    order_roll: roll,
    order_smallprice: 20,
    order_bigprice: 20,
    order_rollprice: 20,
    order_status: 1,
    order_patment: opayment,
    user_id: userid,


  }
  //เพิ่มข้อมูล โดยส่งคำสั่ง SQL เข้าไป
  await mysql.create(sql, data, (err, data) => {
    // if ((err.errno = 1062)) {
    //   return res.status(400).json({
    //     message: 'Username already have',
    //   })
    // }

    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred.',
      })
    else res.status(201).json(data)
  })
}

exports.findAll = async (req, res) => {
  //คำสั่ง SQL
  let sql = `SELECT * FROM orders`
  //ดึงข้อมูล โดยส่งคำสั่ง SQL เข้าไป
  await mysql.get(sql, (err, data) => {
    if (err)
      res.status(err.status).send({
        message: err.message || 'Some error occurred.',
      })
    else if (data) res.status(200).json(data)
    else res.status(204).end()
  })
}

exports.findOne = async (req, res) => {
  //ดึงข้อมูลจาก params
  const { id } = req.params
  // ตรวจสอบความถูกต้อง request
  if (validate_req(req, res, [])) return
  //คำสั่ง SQL
  let sql = `SELECT * FROM orders WHERE user_id = ${id}`
  //ดึงข้อมูล โดยส่งคำสั่ง SQL เข้าไป
  await mysql.get(sql, (err, data) => {
    if (err)
      res.status(err.status).send({
        message: err.message || 'Some error occurred.',
      })
    else if (data) {
           res.status(200).json(data)
    }
    else res.status(204).end()
  })
}
exports.reportOrder = async (req, res) => {
  //ดึงข้อมูลจาก params
  const { startDate, endDate } = req.params
  // ตรวจสอบความถูกต้อง request
  if (validate_req(req, res, [startDate, endDate])) return
  //คำสั่ง SQL
  let sql = `SELECT COUNT(order_id) as totalorder, SUM(order_small) as allordersmall, SUM(order_big) as allorderbig, SUM(order_roll) as allorderroll 
  FROM orders 
  WHERE order_getdate 
  BETWEEN '${startDate}' AND '${endDate}'`
  //ดึงข้อมูล โดยส่งคำสั่ง SQL เข้าไป
  await mysql.get(sql, (err, data) => {
    if (err)
      res.status(err.status).send({
        message: err.message || 'Some error occurred.',
      })
    else if (data) {
           res.status(200).json(data[0])
    }
    else res.status(204).end()
  })
}
exports.update = async (req, res) => {
  //ดึงข้อมูลจาก request
  const { odate, ogetdate,  total, small, big, roll, smallprice, bigprice, rollprice, ostatus } = req.body
  //ดึงข้อมูลจาก params
  const { id } = req.params
  //ตรวจสอบความถูกต้อง request
  if (validate_req(req, res, [id])) return
  //คำสั่ง SQL
  let sql = `UPDATE orders SET order_date = ?, order_getdate  = ?,  order_total = ?,
            order_small = ?, order_big = ?, order_roll = ?, order_smallprice = ?, order_bigprice = ?, order_rollprice = ?, order_status = ? WHERE order_id = ?`
  //ข้อมูลที่จะแก้ไขโดยเรียงตามลำดับ เครื่องหมาย ?
  let data = [odate, ogetdate, , total, small, big, roll, smallprice, bigprice, rollprice, ostatus, id ]
  //แก้ไขข้อมูล โดยส่งคำสั่ง SQL เข้าไป
  await mysql.update(sql, data, (err, data) => {
    if (err)
      res.status(err.status).send({
        message: err.message || 'Some error occurred.',
      })
    else res.status(204).end()

  })
}

exports.deleteOne = async (req, res) => {
  //ดึงข้อมูลจาก params
  const { id } = req.params
  //ตรวจสอบความถูกต้อง request
  if (validate_req(req, res, [id])) return
  //คำสั่ง SQL
  let sql = `DELETE FROM orders WHERE order_id = ?`
  //ข้อมูลที่จะแก้ไขโดยเรียงตามลำดับ เครื่องหมาย ?
  let data = [id]
  //ลบข้อมูล โดยส่งคำสั่ง SQL และ id เข้าไป
  await mysql.delete(sql, data, (err, data) => {
    if (err)
      res.status(err.status).send({
        message: err.message || 'Some error occurred.',
      })
    else res.status(204).end()
  })
}

exports.updateStatus = async (req, res) => {
  //ดึงข้อมูลจาก request
  const { statusOrder } = req.body
  //ดึงข้อมูลจาก params
  const { id } = req.params
  //ตรวจสอบความถูกต้อง request
  if (validate_req(req, res, [id])) return
  //คำสั่ง SQL
  let sql = `UPDATE orders SET order_status = ? WHERE order_id = ?`
  //ข้อมูลที่จะแก้ไขโดยเรียงตามลำดับ เครื่องหมาย ?
  let data = [statusOrder,  id]
  //แก้ไขข้อมูล โดยส่งคำสั่ง SQL เข้าไป
  await mysql.update(sql, data, (err, data) => {
    if (err)
      res.status(err.status).send({
        message: err.message || 'Some error occurred.',
      })
    else res.status(204).end()
  })
}

exports.findOrder = async (req, res) => {
  //คำสั่ง SQL
  let sql = `SELECT oc.order_id,oc.order_date,oc.order_getdate, oc.order_small, oc.order_big, oc.order_roll, oc.order_status,oc.order_payment, uo.user_fname , uo.user_lname,uo.user_number,
  uo.user_id,uo.user_address, uo.lat,uo.lng 
   FROM orders oc LEFT JOIN users uo ON oc.user_id = uo.user_id`
  //ดึงข้อมูล โดยส่งคำสั่ง SQL เข้าไป
  await mysql.get(sql, (err, data) => {
    if (err)
      res.status(err.status).send({
        message: err.message || 'Some error occurred.',
      })
    else if (data) res.status(200).json(data)
    else res.status(204).end()
  })
}

exports.paymentOrder = async (req, res) => {
  // ดึงข้อมูลจาก request
  const file = req.file
  // ดึงข้อมูลจาก params
  const { id } = req.params
  // ตรวจสอบความถูกต้อง request
  if (validate_req(req, res, [id])) return
  // คำสั่ง SQL
  const url = await uploadImage(file)
  console.log(url);

  let sql = `UPDATE orders SET order_payment = '${url}' WHERE order_id = ${id}`
  //ข้อมูลที่จะแก้ไขโดยเรียงตามลำดับ เครื่องหมาย ?

  await mysql.update(sql, (err) => {
    if (err)
      res.status(err.status).send({
        message: err.message || 'Some error occurred.',
      })
    else res.status(204).end()
  })
}