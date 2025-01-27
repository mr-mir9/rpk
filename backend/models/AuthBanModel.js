const Db = require('../config/Db')
const { isArr, isObj } = require('../helpers/IsType')
const DateTime = require('../helpers/DateTime')
const Setting = require('./SettingModel')


async function getObject(rows){
	if(!isArr(rows)) throw new Error('Invalid rows')
	if(!rows.length) return false

	if(!isObj(rows[0])) throw new Error('Invalid row object')
	const row = rows[0]

	const result = { object:'auth_ban', ...rows[0] }
	result.id = String(result.id)
	return result
}
async function getObjects(rows){
	const result = []
	if(!isArr(rows)) throw new Error('Invalid rows')
	for(const row of rows) result.push(await getObject([row]))
	return result
}


exports.getByIp = async (ip) => {
	const now = new Date()
	const sql = `SELECT * FROM auth_ban WHERE ip=? AND date_finish > ? LIMIT 1`
	const bind = [ip, DateTime.formatted(now)]

	const [rows] = await Db.execute(sql, bind)
	return await getObject(rows)
}
exports.add = async (ip) => {
	const dateFinish = new Date()
	const authBanMins = await Setting.getAuthBanMins()
	dateFinish.setUTCMinutes(dateFinish.getUTCMinutes() + authBanMins)

	const sql = `INSERT INTO auth_ban(ip, date_finish) VALUES (?, ?)`
	const bind = [ip, DateTime.formatted(dateFinish)]
	await Db.execute(sql, bind)
}
exports.clearAll = async () => {
	const sql = `DELETE FROM auth_ban`
	await Db.execute(sql)
}