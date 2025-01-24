const Db = require('../config/Db')
const { isArr, isObj } = require('../helpers/IsType')


exports.generateToken = user => {
	return Buffer.from(`user:${user.id};salt:jknbrb786bd;hash:kvusf7v8shuehewfh82935u4hu3`).toString('base64')
}


async function getObject(rows){
	if(!isArr(rows)) throw new Error('Invalid rows')
	if(!rows.length) return false

	if(!isObj(rows[0])) throw new Error('Invalid row object')
	const row = rows[0]

	const result = { object:'user', ...rows[0] }
	return result
}
async function getObjects(rows){
	const result = []
	if(!isArr(rows)) throw new Error('Invalid rows')
	for(const row of rows) result.push(await getObject([row]))
	return result
}


exports.getAll = async id => {
	const sql = `SELECT * FROM user ORDER BY date_create asc`

	const [rows] = await Db.execute(sql)
	return await getObjects(rows)
}
async function getById(id){
	const sql = `SELECT * FROM user WHERE id=?`
	const bind = [id]

	const [rows] = await Db.execute(sql, bind)
	return await getObject(rows)
}
exports.getById = getById
exports.getByRoleLoginPassword = async (role, login, password) => {
	const sql = `SELECT * FROM user WHERE role=? AND login=? AND password=? ORDER BY date_create asc`
	const bind = [role, login, password]

	const [rows] = await Db.execute(sql, bind)
	return await getObject(rows)
}


exports.update = async (id, login, password) => {
	const sql = `UPDATE user SET login=?, password=? WHERE id=?`
	const bind = [login, password, id]

	await Db.execute(sql, bind)
	return await getById(id)
}