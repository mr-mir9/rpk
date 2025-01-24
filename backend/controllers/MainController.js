const asyncHandler = require('express-async-handler')
const InvalidFieldsException = require('../exceptions/InvalidFieldsException')
const InvalidDataException = require('../exceptions/InvalidDataException')
const Validators = require('../helpers/Validators')
const Validation = require('../helpers/Validation')
const User = require('../models/UserModel')
const Material = require('../models/MaterialModel')
const { isObj, isStr } = require('../helpers/IsType')


exports.calculate = asyncHandler(async (req, res) => {
	try{
		const start = performance.now()
		if(!isObj(req)) throw new Error('Invalid request object')
		if(!isObj(req.body)) throw new Error('Invalid request body object')
		let { p, c, t0, m0, b, tr, n, au, z, l, w, h, vu, tu } = req.body

		const errors = []

		if(!isStr(l) || !l.length) errors.push('Введите длину канала')
		else if(!Validators.num(l)) errors.push('Длина канала указана неверно')
		else{
			l = parseFloat(l.replace(/,/, '.'))
			if(!isFinite(l)) errors.push('Длина канала указана неверно')
			else if(l <= 0) errors.push('Длина канала указана неверно')
			else{
				if(!isStr(z) || !z.length) errors.push('Введите шаг дискретизации')
				else if(!Validators.num(z)) errors.push('Шаг дискретизации указан неверно')
				else{
					z = parseFloat(z.replace(/,/, '.'))
					if(!isFinite(z)) errors.push('Шаг дискретизации указан неверно')
					else if(z <= 0) errors.push('Шаг дискретизации не может быть отрицательным или нулевым')
					else if(z > l) errors.push('Шаг дискретизации не может быть больше длины канала')
				}
			}
		}

		if(!isStr(w) || !w.length) errors.push('Введите ширину канала')
		else if(!Validators.num(w)) errors.push('Ширина канала указана неверно')
		else{
			w = parseFloat(w.replace(/,/, '.'))
			if(!isFinite(w)) errors.push('Ширина канала указана неверно')
			else if(w <= 0) errors.push('Ширина канала указана неверно')
		}

		if(!isStr(h) || !h.length) errors.push('Введите высоту канала')
		else if(!Validators.num(h)) errors.push('Высота канала указана неверно')
		else{
			h = parseFloat(h.replace(/,/, '.'))
			if(!isFinite(h)) errors.push('Высота канала указана неверно')
			else if(h <= 0) errors.push('Высота канала указана неверно')
		}

		if(!isStr(p) || !p.length) errors.push('Введите плотность материала')
		else if(!Validators.num(p)) errors.push('Плотность материала указана неверно')
		else{
			p = parseFloat(p.replace(/,/, '.'))
			if(!isFinite(p)) errors.push('Плотность материала указана неверно')
			else if(p <= 0) errors.push('Плотность материала не может быть отрицательной или нулевой')
		}

		if(!isStr(c) || !c.length) errors.push('Введите удельную теплоемкость материала')
		else if(!Validators.num(c)) errors.push('Удельная теплоемкость материала указана неверно')
		else{
			c = parseFloat(c.replace(/,/, '.'))
			if(!isFinite(c)) errors.push('Удельная теплоемкость материала указана неверно')
			else if(c <= 0) errors.push('Удельная теплоемкость материала не может быть отрицательной или нулевой')
		}

		if(!isStr(t0) || !t0.length) errors.push('Введите температуру плавления материала')
		else if(!Validators.num(t0)) errors.push('Температура плавления материала указана неверно')
		else{
			t0 = parseFloat(t0.replace(/,/, '.'))
			if(!isFinite(t0)) errors.push('Температура плавления материала указана неверно')
			else if(t0 <= 0) errors.push('Температура плавления материала не может быть отрицательной или нулевой')
		}

		if(!isStr(vu) || !vu.length) errors.push('Введите скорость крышки')
		else if(!Validators.num(vu)) errors.push('Скорость крышки указана неверно')
		else{
			vu = parseFloat(vu.replace(/,/, '.'))
			if(!isFinite(vu)) errors.push('Скорость крышки указана неверно')
			else if(vu <= 0) errors.push('Скорость крышки не может быть отрицательной или нулевой')
		}

		if(!isStr(tu) || !tu.length) errors.push('Введите температуру крышки')
		else if(!Validators.num(tu)) errors.push('Температура крышки указана неверно')
		else{
			tu = parseFloat(tu.replace(/,/, '.'))
			if(!isFinite(tu)) errors.push('Температура крышки указана неверно')
			else if(tu <= 0) errors.push('Температура крышки не может быть отрицательной или нулевой')
		}

		if(!isStr(m0) || !m0.length) errors.push('Введите коэффициент консистенции материала')
		else if(!Validators.num(m0)) errors.push('Коэффициент консистенции материала указан неверно')
		else{
			m0 = parseFloat(m0.replace(/,/, '.'))
			if(!isFinite(m0)) errors.push('Коэффициент консистенции материала указан неверно')
			else if(m0 <= 0) errors.push('Коэффициент консистенции материала не может быть отрицательным или нулевым')
		}

		if(!isStr(b) || !b.length) errors.push('Введите коэффициент вязкости материала')
		else if(!Validators.num(b)) errors.push('Коэффициент вязкости материала указан неверно')
		else{
			b = parseFloat(b.replace(/,/, '.'))
			if(!isFinite(b)) errors.push('Коэффициент вязкости материала указан неверно')
			else if(b <= 0) errors.push('Коэффициент вязкости материала не может быть отрицательным или нулевым')
		}

		if(!isStr(tr) || !tr.length) errors.push('Введите температуру приведения')
		else if(!Validators.num(tr)) errors.push('Температура приведения указана неверно')
		else{
			tr = parseFloat(tr.replace(/,/, '.'))
			if(!isFinite(tr)) errors.push('Температура приведения указана неверно')
			else if(tr <= 0) errors.push('Температура приведения не может быть отрицательной или нулевой')
		}

		if(!isStr(n) || !n.length) errors.push('Введите индекс течения материала')
		else if(!Validators.num(n)) errors.push('Индекс течения материала указан неверно')
		else{
			n = parseFloat(n.replace(/,/, '.'))
			if(!isFinite(n)) errors.push('Индекс течения материала указан неверно')
			else if(n <= 0) errors.push('Индекс течения материала не может быть отрицательным или нулевым')
		}

		if(!isStr(au) || !au.length) errors.push('Введите коэффициент теплоотдачи')
		else if(!Validators.num(au)) errors.push('Коэффициент теплоотдачи указан неверно')
		else{
			au = parseFloat(au.replace(/,/, '.'))
			if(!isFinite(au)) errors.push('Коэффициент теплоотдачи указан неверно')
			else if(au <= 0) errors.push('Коэффициент теплоотдачи не может быть отрицательным или нулевым')
		}

		if(errors.length) throw new InvalidDataException(errors.join('. '))


		let operations = 12
		const f = 0.125*Math.pow(h/w, 2) - 0.625*h/w + 1
		const qch = h*w*vu*f/2
		const q = p*qch*3600
		let totalT, totalNu


		const points = []
		const toL = parseInt(l * 1000)
		const plusZ = parseInt(z * 1000)
		for(let i = 0; i <= toL; i += plusZ){
			const nowZ = i/1000

			const y = vu/h
			const qy = h*w*m0*Math.pow(y, n+1)
			const qa = w*au*(Math.pow(b,-1)-tu+tr)
			const nowT = tr + Math.log( (b*qy+w*au)*(1-Math.exp(-1*nowZ*b*qa/(p*c*qch)))/(b*qa) + Math.exp(b*(t0-tr-(z*qa/(p*c*qch)))) )/b
			const nu = m0*Math.exp(-1*b*(nowT-tr))*Math.pow(y,n-1)
			if(i === toL){
				totalT = nowT
				totalNu = nu
			}
			points.push({ l:nowZ, t:nowT, nu })
			operations += 45
		}


		const end = performance.now()
		res.ok({ q, t:totalT, nu:totalNu, operations, time:(end-start)*1000, memory:process.memoryUsage().heapUsed/1000000, points })
	}catch(e){
		res.err(e)
	}
})


const parseStrNum = value => {
	return parseFloat(value.replace(',', '.'))
}
exports.save = asyncHandler(async (req, res) => {
	try{
		if(!isObj(req)) throw new Error('Invalid request object')
		if(!isObj(req.body)) throw new Error('Invalid request body object')
		const data = JSON.parse(req.body.data)

		const xl = require('excel4node')
		const wb = new xl.Workbook({
			defaultFont: {
				name: 'Calibri',
				size: 12,
				color: '000000'
			}
		})
		const ws = wb.addWorksheet('Отчет')

		const numberStyle = wb.createStyle({ numberFormat: '# ##0.00' })
		const boldStyle = wb.createStyle({ font: { bold: true }, alignment: { wrapText: true, vertical:['top'] } })
		const wrapStyle = wb.createStyle({ alignment: { wrapText: true, vertical:['top'] } })
		const centerBoldStyle = wb.createStyle({ font: { bold: true }, alignment: { wrapText: true, horizontal:['center'], vertical:['top'] } })

		ws.column(1).setWidth(30)
		ws.column(2).setWidth(20)
		ws.column(3).setWidth(20)
		ws.column(4).setWidth(10)
		ws.column(5).setWidth(52)
		ws.column(6).setWidth(21)

		ws.cell(1, 1).string('Координата по длине канала, м').style(boldStyle)
		ws.cell(1, 2).string('Температура, °C').style(boldStyle)
		ws.cell(1, 3).string('Вязкость, Па*с').style(boldStyle)
		for(let index in data.points){
			const point = data.points[index]
			index = parseInt(index)
			ws.cell(2+index, 1).number(point.l).style(numberStyle)
			ws.cell(2+index, 2).number(point.t).style(numberStyle)
			ws.cell(2+index, 3).number(point.nu).style(numberStyle)
		}

		ws.cell(1, 5, 1, 6, true).string('Входные данные').style(centerBoldStyle)
		ws.cell(2, 5).string('Тип материала').style(boldStyle)
		ws.cell(2, 6).string(data.material_name).style(wrapStyle)
		ws.cell(3, 5).string('Геометрические параметры канала:').style(boldStyle)
		ws.cell(4, 5).string('Ширина, м').style(wrapStyle)
		ws.cell(4, 6).number(parseStrNum(data.input.w)).style(numberStyle)
		ws.cell(5, 5).string('Глубина, м').style(wrapStyle)
		ws.cell(5, 6).number(parseStrNum(data.input.h)).style(numberStyle)
		ws.cell(6, 5).string('Длина, м').style(wrapStyle)
		ws.cell(6, 6).number(parseStrNum(data.input.l)).style(numberStyle)
		ws.cell(7, 5).string('Параметры свойств материала:').style(boldStyle)
		ws.cell(8, 5).string('Плотность, кг/м^3').style(wrapStyle)
		ws.cell(6, 6).number(parseStrNum(data.input.p)).style(numberStyle)
		ws.cell(9, 5).string('Удельная теплоёмкость, Дж/(кг*°С)').style(wrapStyle)
		ws.cell(9, 6).number(parseStrNum(data.input.c)).style(numberStyle)
		ws.cell(10, 5).string('Температура плавления, °С').style(wrapStyle)
		ws.cell(10, 6).number(parseStrNum(data.input.t0)).style(numberStyle)
		ws.cell(11, 5).string('Режимные параметры процесса:').style(boldStyle)
		ws.cell(12, 5).string('Скорость крышки, м/с').style(wrapStyle)
		ws.cell(12, 6).number(parseStrNum(data.input.vu)).style(numberStyle)
		ws.cell(13, 5).string('Температура крышки, °С').style(wrapStyle)
		ws.cell(12, 6).number(parseStrNum(data.input.tu)).style(numberStyle)
		ws.cell(14, 5).string('Эмпирические коэффициенты математической модели:').style(boldStyle)
		ws.cell(15, 5).string('Коэффициент консистенции при температуре приведения, Па*с^n').style(wrapStyle)
		ws.cell(15, 6).number(parseStrNum(data.input.m0)).style(numberStyle)
		ws.cell(16, 5).string('Температурный коэффициент вязкости, 1/°С').style(wrapStyle)
		ws.cell(16, 6).number(parseStrNum(data.input.b)).style(numberStyle)
		ws.cell(17, 5).string('Температура приведения, °С').style(wrapStyle)
		ws.cell(17, 6).number(parseStrNum(data.input.tr)).style(numberStyle)
		ws.cell(18, 5).string('Индекс течения материала').style(wrapStyle)
		ws.cell(18, 6).number(parseStrNum(data.input.n)).style(numberStyle)
		ws.cell(19, 5).string('Коэффициент теплоотдачи от крышки канала к материалу, Вт/(м^2*°C)').style(wrapStyle)
		ws.cell(19, 6).number(parseStrNum(data.input.au)).style(numberStyle)
		ws.cell(20, 5).string('Критериальные показатели процесса:').style(boldStyle)
		ws.cell(21, 5).string('Производительность, кг/ч').style(wrapStyle)
		ws.cell(21, 6).number(data.q).style(numberStyle)
		ws.cell(22, 5).string('Температура продукта, °С').style(wrapStyle)
		ws.cell(22, 6).number(data.t).style(numberStyle)
		ws.cell(23, 5).string('Вязкость продукта, Па*с').style(wrapStyle)
		ws.cell(23, 6).number(data.nu).style(numberStyle)
		wb.write('Report.xlsx', res)
	}catch(e){
		res.send(`Ошибка: ${e.message}`)
	}
})


exports.admin = asyncHandler(async (req, res) => {
	try{
		res.ok({ users:await User.getAll(), materials:await Material.getAll() })
	}catch(e){
		res.err(e)
	}
})


exports.login = asyncHandler(async (req, res) => {
	try{
		if(!isObj(req)) throw new Error('Invalid request object')
		if(!isObj(req.body)) throw new Error('Invalid request body object')


		const data = { body:req.body, errors:[] }
		await Validation.role(data)
		await Validation.login(data)
		await Validation.password(data)
		if(data.errors.length) throw new InvalidDataException(data.errors.join('. '))


		const user = await User.getByRoleLoginPassword(data.body.role, data.body.login, data.body.password)
		if(!user) throw new InvalidDataException('Пользователь с такими данными не найден')

		res.ok({ object:'session', token:User.generateToken(user), user })
	}catch(e){
		res.err(e)
	}
})


exports.editUser = asyncHandler(async (req, res) => {
	try{
		if(!isObj(req)) throw new Error('Invalid request object')
		if(!isObj(req.body)) throw new Error('Invalid request body object')

		const { user_id:userId, login, password } = req.body

		const user = await User.getById(userId)
		if(!user) throw new InvalidDataException('Пользователь не существует')

		const data = { body:{ userId, login, password }, errors:[] }
		await Validation.login(data)
		await Validation.password(data)
		if(data.errors.length) throw new InvalidDataException(data.errors.join('. '))

		const updatedUser = await User.update(userId, login, password)

		res.ok(updatedUser)
	}catch(e){
		res.err(e)
	}
})


exports.addMaterial = asyncHandler(async (req, res) => {
	try{
		if(!isObj(req)) throw new Error('Invalid request object')
		if(!isObj(req.body)) throw new Error('Invalid request body object')

		const data = { body:req.body, errors:[] }
		await Validation.materialName(data)
		await Validation.materialProp(data, 'p', 'Введите плотность материала', 'Плотность материала указана неверно', 'Плотность материала не может быть отрицательной или нулевой')
		await Validation.materialProp(data, 'c', 'Введите удельную теплоемкость материала', 'Удельная теплоемкость материала указана неверно', 'Удельная теплоемкость материала не может быть отрицательной или нулевой')
		await Validation.materialProp(data, 't0', 'Введите температуру плавления материала', 'Температура плавления материала указана неверно', 'Температура плавления материала не может быть отрицательной или нулевой')
		await Validation.materialProp(data, 'm0', 'Введите коэффициент консистенции материала', 'Коэффициент консистенции материала указан неверно', 'Коэффициент консистенции материала не может быть отрицательным или нулевым')
		await Validation.materialProp(data, 'b', 'Введите коэффициент вязкости материала', 'Коэффициент вязкости материала указан неверно', 'Коэффициент вязкости материала не может быть отрицательным или нулевым')
		await Validation.materialProp(data, 'tr', 'Введите температуру приведения', 'Температура приведения указана неверно', 'Температура приведения не может быть отрицательной или нулевой')
		await Validation.materialProp(data, 'n', 'Введите индекс течения материала', 'Индекс течения материала указан неверно', 'Индекс течения материала не может быть отрицательным или нулевым')
		await Validation.materialProp(data, 'au', 'Введите коэффициент теплоотдачи', 'Коэффициент теплоотдачи указан неверно', 'Коэффициент теплоотдачи не может быть отрицательным или нулевым')
		if(data.errors.length) throw new InvalidDataException(data.errors.join('. '))

		const material = await Material.create(data.body)

		res.ok(material)
	}catch(e){
		res.err(e)
	}
})

exports.editMaterial = asyncHandler(async (req, res) => {
	try{
		if(!isObj(req)) throw new Error('Invalid request object')
		if(!isObj(req.body)) throw new Error('Invalid request body object')

		const data = { body:req.body, errors:[] }
		await Validation.materialName(data)
		await Validation.materialProp(data, 'p', 'Введите плотность материала', 'Плотность материала указана неверно', 'Плотность материала не может быть отрицательной или нулевой')
		await Validation.materialProp(data, 'c', 'Введите удельную теплоемкость материала', 'Удельная теплоемкость материала указана неверно', 'Удельная теплоемкость материала не может быть отрицательной или нулевой')
		await Validation.materialProp(data, 't0', 'Введите температуру плавления материала', 'Температура плавления материала указана неверно', 'Температура плавления материала не может быть отрицательной или нулевой')
		await Validation.materialProp(data, 'm0', 'Введите коэффициент консистенции материала', 'Коэффициент консистенции материала указан неверно', 'Коэффициент консистенции материала не может быть отрицательным или нулевым')
		await Validation.materialProp(data, 'b', 'Введите коэффициент вязкости материала', 'Коэффициент вязкости материала указан неверно', 'Коэффициент вязкости материала не может быть отрицательным или нулевым')
		await Validation.materialProp(data, 'tr', 'Введите температуру приведения', 'Температура приведения указана неверно', 'Температура приведения не может быть отрицательной или нулевой')
		await Validation.materialProp(data, 'n', 'Введите индекс течения материала', 'Индекс течения материала указан неверно', 'Индекс течения материала не может быть отрицательным или нулевым')
		await Validation.materialProp(data, 'au', 'Введите коэффициент теплоотдачи', 'Коэффициент теплоотдачи указан неверно', 'Коэффициент теплоотдачи не может быть отрицательным или нулевым')
		if(data.errors.length) throw new InvalidDataException(data.errors.join('. '))

		if(!isStr(data.body.id)) throw new InvalidDataException('Материал не найден')
		const material = await Material.getById(data.body.id)
		if(!material) throw new InvalidDataException('Материал не найден')

		const updatedMaterial = await Material.update(data.body)

		res.ok(updatedMaterial)
	}catch(e){
		res.err(e)
	}
})


exports.deleteMaterial = asyncHandler(async (req, res) => {
	try{
		if(!isObj(req)) throw new Error('Invalid request object')
		if(!isObj(req.params)) throw new Error('Invalid request params object')

		const { id } = req.params
		const material = await Material.getById(id)
		if(!material) throw new InvalidDataException('Материал не найден')

		await Material.delete(id)

		res.ok('ok')
	}catch(e){
		res.err(e)
	}
})


exports.getMaterials = asyncHandler(async (req, res) => {
	try{
		res.ok(await Material.getAll())
	}catch(e){
		res.err(e)
	}
})