const validate_req = require('../models/validate_req.models')
const mysql = require('../models/mysql.models')
const { verifyingHash, hashPassword } = require('../models/hashing.models')
const { sign } = require('../models/middleware.models')

exports.create = async (req, res) => {
  //ดึงข้อมูลจาก request
  const { fname, lname, number, role, address, username, password, } = req.body
  //ตรวจสอบความถูกต้อง request
  if (validate_req(req, res, [username, password])) return
  //คำสั่ง SQL
  let sql = `INSERT INTO users SET ?`
  //ข้อมูลที่จะใส่ ชื่อฟิล : ข้อมูล
  let data = {
    
    user_fname: fname,
    user_lname: lname,
    user_number: number,
    user_role: role,
    user_address: address,
    user_name: username,
    user_password: hashPassword(password),
    
  }
  //เพิ่มข้อมูล โดยส่งคำสั่ง SQL เข้าไป
  await mysql.create(sql, data, async (err, data) => {
    // if ((err.errno = 1062)) {
    //   return res.status(400).json({
    //     message: 'Username already have',
    //   })
    // }

    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred.',
      })
    else {
      data.token = await sign({id: data.user_id},'3h')
      res.status(201).json(data)
    }
  })
}

exports.findAll = async (req, res) => {
  //คำสั่ง SQL
  let sql = `SELECT * FROM users`
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
  let sql = `SELECT * FROM users WHERE user_id = ${id}`
  //ดึงข้อมูล โดยส่งคำสั่ง SQL เข้าไป
  await mysql.get(sql, (err, data) => {
    if (err)
      res.status(err.status).send({
        message: err.message || 'Some error occurred.',
      })
    else if (data[0]) {
           res.status(200).json(data[0])
    }
    else res.status(204).end()
  })
}

exports.update = async (req, res) => {
  //ดึงข้อมูลจาก request
  const { fname, lname, number , address } = req.body
  //ดึงข้อมูลจาก params
  const { id } = req.params
  //ตรวจสอบความถูกต้อง request
  if (validate_req(req, res, [id])) return
  //คำสั่ง SQL
  let sql = `UPDATE users SET user_fname = ?,user_lname  = ?,user_number = ?,user_address = ? WHERE user_id = ?`
  //ข้อมูลที่จะแก้ไขโดยเรียงตามลำดับ เครื่องหมาย ?
  let data = [fname, lname, number , address ,  id]
  //แก้ไขข้อมูล โดยส่งคำสั่ง SQL เข้าไป
  await mysql.update(sql, data, (err, data) => {
    if (err)
      res.status(err.status).send({
        message: err.message || 'Some error occurred.',
      })
    else res.status(204).end()
  })
}
exports.updatepassword = async (req, res) => {
  //ดึงข้อมูลจาก request
  const { password } = req.body
  //ดึงข้อมูลจาก params
  const { id } = req.params
  //ตรวจสอบความถูกต้อง request
  if (validate_req(req, res, [id])) return
  //คำสั่ง SQL
  let sql = `UPDATE users SET user_password = ? WHERE user_id = ?`
  //ข้อมูลที่จะแก้ไขโดยเรียงตามลำดับ เครื่องหมาย ?
  let data = [ hashPassword(password) ,id]
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
  let sql = `DELETE FROM users WHERE user_id = ?`
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
exports.login = async (req, res) =>{
  const { username, password} = req.body
  if(validate_req(req, res [username, password])) return

  let sql = `SELECT * FROM users WHERE user_name = '${username}'`

  await mysql.get(sql, async (err, data) => {
    if (err)
      res.status(err.status).send({
        message: err.message || 'Some error occurred.',
      })
    else if (data[0] && verifyingHash(password,data[0].user_password)){
        data[0].token = await sign({id: data[0].user_id},'3h')
        delete data[0].user_password
        res.status(200).json(data[0])
    }
    else res.status(204).end()
  })


}
// exports.login = async (req, res) => {
//   const { username, password } = req.body

//   // ตรวจสอบความถูกต้อง request
//   if (validate_req(req, res, [username, password])) return
//   // คำสั่ง SQL
//   let sql = `SELECT * FROM users WHERE user_name = '${username}'`
//   //ดึงข้อมูล โดยส่งคำสั่ง SQL เข้าไป
//   await mysql.get(sql, async (err, data) => {
//     if (err)
//       res.status(err.status).send({
//         message: err.message || 'Some error occurred.',
//       })
//     else if (data[0] && password == data[0].password) {
//       // data[0].token = await signtoken({ id: data[0].id },'1d')verifyingHash(
//       delete data[0].password
//       res.status(200).json(data[0])
//     } else res.status(204).end()
//     })
//   }



// exports.number =  (req, res) => {
//   const { num1, num2 } = req.body
//   // ตรวจสอบความถูกต้อง request
//   if (validate_req(req, res, [num1, num2])) return

//   let number = num1 * num2
//   let number2 = parseInt(num1) + parseInt(num2)

//   res.status(200).json({
//     num1 : number,
//     num2 : number2
//    })
// 
