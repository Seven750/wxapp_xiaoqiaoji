const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
exports.main = async (event, context) => {
  // 先取出集合记录总数
  const countResult = await db.collection('Goods').count()
  const total = countResult.total
  if(total==0)
    return "无记录"
  else{
    // 计算需分几次取
    const batchTimes = Math.ceil(total / 100)
    // 承载所有读操作的 promise 的数组
    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection('Goods').where({
        _openid: event.userid
      }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
      tasks.push(promise)
    }
    const result = (await Promise.all(tasks))[0].data

    return result.reduce(getName, []);
  }


}
//提取对应的货物信息
function getName(total, currentValue){
  
  total.push(currentValue.GoodName)
  return total
}