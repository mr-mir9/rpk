import { useState, useMemo, useCallback } from 'react'
import { isStr, isArr } from '../helpers/IsType'
import { useApi, parseNetworkError } from '../lib/Api'
import Field from '../helpers/Field'

import { ReactComponent as AlertTriangleSvg } from '../icons/AlertTriangle.svg'
import { ReactComponent as CheckmarkCircleSvg } from '../icons/CheckmarkCircle.svg'


function AdminSettings({ data }){

	const api = useApi()


	const [savedAuthCountAttempts, savedAuthBanMins] = useMemo(() => {
		let authCountAttempts = ''
		let authBanMins = ''
		if(!isArr(data.settings)) return [authCountAttempts, authBanMins]
		
		for(const setting of data.settings){
			const { name, value } = setting
			if(name === 'auth_count_attempts') authCountAttempts = value
			if(name === 'auth_ban_mins') authBanMins = value
		}

		return [authCountAttempts, authBanMins]
	}, [data])


	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const [success, setSuccess] = useState(false)
	const [authCountAttempts, setAuthCountAttempts] = useState(savedAuthCountAttempts)
	const [authBanMins, setAuthBanMins] = useState(savedAuthBanMins)


	const submitHandler = useCallback(e => {
		e.preventDefault()
		setLoading(true)
		setError(null)
		setSuccess(false)

		api.saveSettings(authCountAttempts, authBanMins)
		.then(() => { setSuccess(true) })
		.catch(e => parseNetworkError(e, null, setError))
		.finally(() => setLoading(false))
	}, [api, authCountAttempts, authBanMins])


	return (
		<div className='admin-page__settings'>
			<div className='admin-page__settings-container'>
				<div className='form-field'><a href={`${process.env.REACT_APP_API}/v1/admin/db`} target='_blank' rel='noreferrer' className='btn blue-outline'>Создать резервную копию базы данных</a></div>
			</div>
			<div className='admin-page__settings-container'>
				<form className='form' onSubmit={submitHandler}>
					<div className='input-page__warning t12 lh140'><AlertTriangleSvg /><div>Изменение этих параметров приведет к очистке таблицы с заблокированными пользователями и историями попыток</div></div>
					<div className='form-field form-field__type'><Field label='Количество попыток авторизации' value={authCountAttempts} setValue={setAuthCountAttempts} disabled={loading} pattern={/^[0-9]{0,3}$/} /><div className='t16'>–</div></div>
					<div className='form-field form-field__type'><Field label='Время блокировки авторизации' value={authBanMins} setValue={setAuthBanMins} disabled={loading} pattern={/^[0-9]{0,3}$/} /><div className='t16'>минут</div></div>
					{isStr(error) && error.length ? (
						<div className='form-error t14 lh120'>
							<AlertTriangleSvg />
							<div>{error}</div>
						</div>
					) : null}
					{success ? (
						<div className='form-success t14 lh120'>
							<CheckmarkCircleSvg />
							<div>Данные успешно сохранены в БД</div>
						</div>
					) : null}
					<div className='form-btn'><button type='submit' className='btn xl blue' disabled={loading}>{loading ? 'Отправка...' : 'Сохранить'}</button></div>
				</form>
			</div>
		</div>
	)

}
export default AdminSettings