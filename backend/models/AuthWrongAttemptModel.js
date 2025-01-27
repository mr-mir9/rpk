const Db = require('../config/Db')
const { isArr, isObj } = require('../helpers/IsType')
const DateTime = require('../helpers/DateTime')


async function getObject(rows){
	if(!isArr(rows)) throw new Error('Invalid rows')
	if(!rows.length) return false

	if(!isObj(rows[0])) throw new Error('Invalid row object')
	const row = rows[0]

	const result = { object:'auth_wrong_attempt', ...rows[0] }
	result.id = String(result.id)
	return result
}
async function getObjects(rows){
	const result = []
	if(!isArr(rows)) throw new Error('Invalid rows')
	for(const row of rows) result.push(await getObject([row]))
	return result
}


exports.add = async (ip) => {
	const now = new Date()
	const sql = `INSERT INTO auth_wrong_attempts (ip, date_attempt) VALUES (?, ?)`
	const bind = [ip, DateTime.formatted(now)]

	await Db.execute(sql, bind)
}
exports.get = async (ip) => {
	const sql = `SELECT COUNT(*) as count FROM auth_wrong_attempts WHERE ip=?`
	const bind = [ip]

	const [rows] = await Db.execute(sql, bind)
	return rows[0].count
}
exports.clear = async (ip) => {
	const sql = `DELETE FROM auth_wrong_attempts WHERE ip=?`
	const bind = [ip]
	await Db.execute(sql, bind)
}
exports.clearAll = async () => {
	const sql = `DELETE FROM auth_wrong_attempts`
	await Db.execute(sql)
}