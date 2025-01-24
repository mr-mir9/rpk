import { useMemo } from 'react'
import { isObj, isStr, isNum, isFile, isArr, isNetInv, isNetInvFields } from '../helpers/IsType'
import { useUser } from '../lib/User'
import { NetworkInvalidException, NetworkInvalidFieldsException } from '../helpers/Exceptions'
import axios from 'axios'


function parseNetworkError(e, fields, main){
	if(isNetInvFields(e)){
		const unprocessedFieldsMessages = []
		if(!isObj(e.fields)) e.fields = {}
		for(const fieldNameError in e.fields){
			let found = false
			for(const fieldNameSetter in fields){
				if(fieldNameSetter !== fieldNameError) continue;

				found = true
				fields[fieldNameSetter](e.fields[fieldNameError])
				break;
			}
			if(!found) unprocessedFieldsMessages.push(e.fields[fieldNameError])
		}
		if(unprocessedFieldsMessages.length) main(unprocessedFieldsMessages.join('. '))
		return;
	}
	if(isNetInv(e)) main(e.message)
}


function getRoleName(role){
	const roles = {
		admin:'Администратор',
		user:'Исследователь'
	}
	return !isStr(roles[role]) ? 'Неизвестно' : roles[role]
}


function Api(bearer){

	const result = {}
	const baseURL = process.env.REACT_APP_API

	const Request = options => {
		if(!isObj(options)) options = {}
		let { method, url, data, headers, object, bearer, requestType=null } = options
		if(!isObj(headers)) headers = {}

		let resolve, reject
		const promise = new Promise((res, rej) => { resolve=res; reject=rej })

		if(!['GET', 'POST', 'PUT', 'DELETE'].includes(method)) throw new Error('Invalid method')
		if(!isStr(url) || !url.length) throw new Error('URL not passed')
		if(isStr(bearer)) headers['Authorization'] = `Bearer ${bearer}`

		const request = { method, baseURL, url, timeout:10000 }
		if(isObj(headers)) request.headers = headers
		if(isObj(data)){
			if(method === 'GET' || method === 'DELETE') request.params = data
			else if(requestType === 'multipart'){
				const formData = new FormData()
				for(const field in data){
					const value = data[field]
					if(isStr(value) || isNum(value) || isFile(value)) formData.append(field, value)
					else if(isArr(value)){
						for(const valueArr of value) formData.append(`${field}[]`, valueArr)
					}else console.error(`IGNORED VALUE ${field} : ${value}`)
				}
				request.data = formData
			}else request.data = data
		}

		axios(request)
		.then(response => {
			if(!isObj(response) || !isObj(response.data) || response.data.status !== 'ok') reject(new NetworkInvalidException('Невалидный ответ от API'))
			else if(isStr(object) && object.length && (!isObj(response.data.data) || response.data.data.object !== object)) reject(new NetworkInvalidException('Невалидный ответ от API'))
			else resolve(response.data.data)
		})
		.catch(err => {
			if(isObj(err.response) && isObj(err.response.data)){
				const data = err.response.data
				if(data.status === 'error' && isStr(data.message)) reject(new NetworkInvalidException(data.message))
				else if(data.status === 'error' && isObj(data.fields)) reject(new NetworkInvalidFieldsException(data.fields))
				else reject(new NetworkInvalidException('Невалидный ответ от API'))
			}else reject(new NetworkInvalidException('Произошла ошибка при запросе к API'))
		})

		return promise
	}

	result.calculate = requestBody => Request({ method:'POST', url:'/v1/calculate', bearer, data:requestBody })
	result.admin = requestBody => Request({ method:'GET', url:'/v1/admin', bearer })
	result.login = (role, login, password) => Request({ method:'POST', url:'/v1/login', bearer, data:{ role, login, password } })
	result.editUser = (userId, login, password) => Request({ method:'PUT', url:'/v1/admin/user', bearer, data:{ user_id:userId, login, password } })
	result.addMaterial = requestBody => Request({ method:'POST', url:'/v1/admin/material', bearer, data:requestBody })
	result.editMaterial = requestBody => Request({ method:'PUT', url:'/v1/admin/material', bearer, data:requestBody })
	result.deleteMaterial = materialId => Request({ method:'DELETE', url:`/v1/admin/material/${materialId}`, bearer })
	result.getMaterials = materialId => Request({ method:'GET', url:`/v1/materials`, bearer })

	return result

}

function useApi(){

	const userData = useUser()
	const api = useMemo(() => Api(isObj(userData) && isStr(userData.token) ? userData.token : ''), [userData])
	return api

}

export { useApi, parseNetworkError, getRoleName }