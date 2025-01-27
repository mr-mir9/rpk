const Db = require('../config/Db')
const { isArr, isObj } = require('../helpers/IsType')


async function getObject(rows){
	if(!isArr(rows)) throw new Error('Invalid rows')
	if(!rows.length) return false

	if(!isObj(rows[0])) throw new Error('Invalid row object')
	const row = rows[0]

	const result = { object:'setting', ...rows[0] }
	return result
}
async function getObjects(rows){
	const result = []
	if(!isArr(rows)) throw new Error('Invalid rows')
	for(const row of rows) result.push(await getObject([row]))
	return result
}


exports.getAll = async id => {
	const sql = `SELECT * FROM setting`

	const [rows] = await Db.execute(sql)
	return await getObjects(rows)
}
exports.getAuthCountAttempts = async () => {
	const sql = `SELECT * FROM setting WHERE name='auth_count_attempts'`

	const [rows] = await Db.execute(sql)
	return parseInt(rows[0].value)
}
exports.getAuthBanMins = async () => {
	const sql = `SELECT * FROM setting WHERE name='auth_ban_mins'`

	const [rows] = await Db.execute(sql)
	return parseInt(rows[0].value)
}
exports.update = async (authCountAttempts, authBanMins) => {
	const sql = `UPDATE setting SET value=? WHERE name=?`
	let bind = [authCountAttempts, 'auth_count_attempts']
	await Db.execute(sql, bind)

	bind = [authBanMins, 'auth_ban_mins']
	await Db.execute(sql, bind)
}