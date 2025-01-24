import { useState, useMemo, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { isStr } from '../helpers/IsType'
import { useApi, parseNetworkError } from '../lib/Api'
import { useUser } from '../lib/User'
import Validators from '../helpers/Validators'
import Field from '../helpers/Field'
import Select, { Option } from '../helpers/Select'

import { ReactComponent as AlertTriangleSvg } from '../icons/AlertTriangle.svg'


function AuthForm(){

	const { loginHandler } = useUser()
	const api = useApi()
	const navigate = useNavigate()


	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const [role, setRole] = useState('')

	const [login, setLogin] = useState('')
	const [loginValid, setLoginValid] = useState(false)
	const [loginErr, setLoginErr] = useState(null)
	const loginValidators = useMemo(() => [Validators.required(true)], [])

	const [password, setPassword] = useState('')
	const [passwordValid, setPasswordValid] = useState(false)
	const [passwordErr, setPasswordErr] = useState(null)
	const passwordValidators = useMemo(() => [Validators.required()], [])

	useEffect(() => { setError(null) }, [role, login, password])

	const disabled = useMemo(() => {
		if(loading) return true
		if(!['user', 'admin'].includes(role)) return true
		if(!loginValid || !passwordValid) return true
		return false
	}, [loading, role, loginValid, passwordValid])


	const submitHandler = useCallback(e => {
		e.preventDefault()
		setLoading(true)

		api.login(role, login, password)
		.then(session => {
			loginHandler(session)

			const { user } = session
			if(user.role === 'admin') navigate('/admin', { replace: true })
			else navigate('/calculate', { replace: true })
		})
		.catch(e => parseNetworkError(e, null, setError))
		.finally(() => setLoading(false))
	}, [loginHandler, api, role, login, password, navigate])


	return (
		<form className='auth-page__form' onSubmit={submitHandler}>
			<div className='form-title m24'>Авторизация</div>
			{isStr(error) && error.length ? (
				<div className='form-error t14'>
					<AlertTriangleSvg />
					<div>{error}</div>
				</div>
			) : null}
			<div className='form-field'>
				<Select label='Роль пользователя' onChange={setRole}>
					<Option value='user' selected={role==='user'}>Исследователь</Option>
					<Option value='admin' selected={role==='admin'}>Администратор</Option>
				</Select>
			</div>
			<div className='form-field'><Field label='Логин *' value={login} setValue={setLogin} err={loginErr} setErr={setLoginErr} setValid={setLoginValid} validators={loginValidators} disabled={loading} /></div>
			<div className='form-field'><Field label='Пароль *' type='password' value={password} setValue={setPassword} err={passwordErr} setErr={setPasswordErr} setValid={setPasswordValid} validators={passwordValidators} disabled={loading} /></div>
			<div className='form-btn'><button type='submit' className='btn blue' disabled={disabled}>Вход</button></div>
		</form>
	)

}
export default AuthForm