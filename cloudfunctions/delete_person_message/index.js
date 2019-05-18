// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  const wxContext = cloud.getWXContext()
  try{
    return await db.collection(event.database).where({
      _openid: wxContext.OPENID,
    }).remove()
  } catch(e){
    console.error(e)
  }
}