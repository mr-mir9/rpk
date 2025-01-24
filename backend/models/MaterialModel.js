const Db = require('../config/Db')
const { isArr, isObj } = require('../helpers/IsType')
const DateTime = require('../helpers/DateTime')


async function getObject(rows){
	if(!isArr(rows)) throw new Error('Invalid rows')
	if(!rows.length) return false

	if(!isObj(rows[0])) throw new Error('Invalid row object')
	const row = rows[0]

	const result = { object:'material', ...rows[0] }
	result.id = String(result.id)
	return result
}
async function getObjects(rows){
	const result = []
	if(!isArr(rows)) throw new Error('Invalid rows')
	for(const row of rows) result.push(await getObject([row]))
	return result
}


exports.getAll = async id => {
	const sql = `SELECT * FROM material ORDER BY date_create asc`

	const [rows] = await Db.execute(sql)
	return await getObjects(rows)
}
async function getById(id){
	const sql = `SELECT * FROM material WHERE id=?`
	const bind = [id]

	const [rows] = await Db.execute(sql, bind)
	return await getObject(rows)
}
exports.getById = getById


exports.create = async (data) => {
	const now = new Date()
	const sql = `INSERT INTO material (name, prop_p, prop_c, prop_t0, prop_m0, prop_b, prop_tr, prop_n, prop_au, date_create) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
	const bind = [data.name, data.p, data.c, data.t0, data.m0, data.b, data.tr, data.n, data.au, DateTime.formatted(now)]

	const id = Db.getInseretId(await Db.execute(sql, bind))
	return await getById(id)
}
exports.update = async (data) => {
	const sql = `UPDATE material SET name=?, prop_p=?, prop_c=?, prop_t0=?, prop_m0=?, prop_b=?, prop_tr=?, prop_n=?, prop_au=? WHERE id=?`
	const bind = [data.name, data.p, data.c, data.t0, data.m0, data.b, data.tr, data.n, data.au, data.id]
	await Db.execute(sql, bind)
	
	return await getById(data.id)
}
exports.delete = async (id) => {
	sql = `DELETE FROM material WHERE id=?`
	bind = [id]
	await Db.execute(sql, bind)

	return true
}