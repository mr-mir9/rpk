const { isStr } = require('../helpers/IsType')
const Validators = require('./Validators')


module.exports.role = data => {
	try{
		if(!isStr(data.body.role) || !data.body.role.length) throw new Error('Введите роль пользователя')
		else{
			if(!['admin', 'user'].includes(data.body.role)) throw new Error('Такой роли не существует')
			return true
		}
	}catch(e){
		data.errors.push(e.message)
	}
}


module.exports.login = data => {
	try{
		if(!isStr(data.body.login) || !data.body.login.length) throw new Error('Введите логин')
		else{
			data.body.login = data.body.login.trim()
			if(!data.body.login.length) throw new Error('Введите логин')
			else if(!/^[a-z0-9]+$/i.test(data.body.login)) throw new Error('Логин может содержать только латинские буквы и цифры')
			else if(data.body.login.length > 64) throw new Error('Максимальная длина логина 64 символа')
			return true
		}
	}catch(e){
		data.errors.push(e.message)
	}
}


module.exports.password = data => {
	try{
		if(!isStr(data.body.password) || !data.body.password.length) throw new Error('Введите пароль')
		else{
			if(data.body.password.length > 64) throw new Error('Максимальная длина пароля 64 символа')
			return true
		}
	}catch(e){
		data.errors.push(e.message)
	}
}


module.exports.materialName = data => {
	try{
		if(!isStr(data.body.name) || !data.body.name.length) throw new Error('Введите название материала')
		else{
			data.body.name = data.body.name.trim()
			if(!data.body.name.length) throw new Error('Введите название материала')
			else if(data.body.name.length > 128) throw new Error('Максимальная длина названия 128 символов')
			return true
		}
	}catch(e){
		data.errors.push(e.message)
	}
}
module.exports.materialProp = (data, prop, txtEmpty, txtInvalid, txtNegative) => {
	try{
		if(!isStr(data.body[prop]) || !data.body[prop].length) data.errors.push(txtEmpty)
		else if(!Validators.num(data.body[prop])) data.errors.push(txtInvalid)
		else{
			data.body[prop] = parseFloat(data.body[prop].replace(/,/, '.'))
			if(!isFinite(data.body[prop])) data.errors.push(txtEmpty)
			else if(data.body[prop] <= 0) data.errors.push(txtNegative)
		}
	}catch(e){
		data.errors.push(e.message)
	}
}