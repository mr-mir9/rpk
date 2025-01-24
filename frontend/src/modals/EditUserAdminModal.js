import { useCallback, useState, useMemo } from 'react'
import { isTrue, isStr } from '../helpers/IsType'
import { useApi, parseNetworkError } from '../lib/Api'
import Select, { Option } from '../helpers/Select'
import Field from '../helpers/Field'
import Validators from '../helpers/Validators'

import { ReactComponent as CloseSvg } from '../icons/Close.svg'
import { ReactComponent as AlertTriangleSvg } from '../icons/AlertTriangle.svg'


function EditUserAdminModal({ callback, user }){

	const api = useApi()


	const closeHandler = useCallback(e => {
		e.preventDefault()
		callback(null)
	}, [callback])


	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)


	const [login, setLogin] = useState(user.login)
	const [loginValid, setLoginValid] = useState(false)
	const [loginErr, setLoginErr] = useState(false)
	const loginValidators = useMemo(() => [Validators.required(true)], [])

	const [password, setPassword] = useState(user.password)
	const [passwordValid, setPasswordValid] = useState(false)
	const [passwordErr, setPasswordErr] = useState(false)
	const passwordValidators = useMemo(() => [Validators.required()], [])


	const disabled = useMemo(() => {
		if(loading) return true
		if(!isTrue(loginValid) || !isTrue(passwordValid)) return true
		return false
	}, [loading, loginValid, passwordValid])


	const submitHandler = useCallback(e => {
		e.preventDefault()
		setLoading(true)
		setError(null)

		api.editUser(user.id, login, password)
		.then(callback)
		.catch(e => parseNetworkError(e, null, setError))
		.finally(() => setLoading(false))
	}, [callback, api, user, login, password])


	return (
		<div className='modal-content'>
			<div className='modal-title'>
				<div className='m21 color-blue'>Редактирование пользователя</div>
				<CloseSvg onClick={closeHandler} />
			</div>
			<form className='form' onSubmit={submitHandler}>
				<div className='form-field'>
					<Select label='Роль пользователя' disabled>
						<Option value='admin' selected={user.role==='admin'}>Администратор</Option>
						<Option value='user' selected={user.role==='user'}>Исследователь</Option>
					</Select>
				</div>
				<div className='form-field'><Field label='Логин *' value={login} setValue={setLogin} err={loginErr} setErr={setLoginErr} setValid={setLoginValid} validators={loginValidators} disabled={loading} /></div>
				<div className='form-field'><Field label='Пароль *' value={password} setValue={setPassword} err={passwordErr} setErr={setPasswordErr} setValid={setPasswordValid} validators={passwordValidators} disabled={loading} /></div>
				{isStr(error) && error.length ? (
					<div className='form-error t14 lh120'>
						<AlertTriangleSvg />
						<div>{error}</div>
					</div>
				) : null}
				<div className='form-btn'><button type='submit' className='btn xl blue' disabled={disabled}>{loading ? 'Отправка...' : 'Сохранить'}</button></div>
			</form>
		</div>
	)

}
export default EditUserAdminModal