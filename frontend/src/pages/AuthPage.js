import { useState, useEffect, useCallback } from 'react'
import { useApi, parseNetworkError } from '../lib/Api'
import { isStr, isObj, isTrue } from '../helpers/IsType'
import AuthForm from '../components/AuthForm'
import DateTime from '../helpers/DateTime'


function AuthPage(){

	const api = useApi()

	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [access, setAccess] = useState(null)


	const refresh = useCallback(() => {
		setLoading(true)
		setError(null)

		api.access()
		.then(data => {
			setAccess(data)
			setLoading(false)
		})
		.catch(e => parseNetworkError(e, null, setError))
	}, [api])
	useEffect(() => { refresh() }, [refresh])

	return (
		<div className='auth-page'>
			<div className='auth-page__logo logo m18 lh120'>
				<div />
				<div>Исследование неизотермического течения аномально-вязких материалов</div>
			</div>
			{loading ? <div className='auth-loading m18 center color-blue'>Проверка доступа...</div> :
				isStr(error) && error.length ? <div className='auth-blocked center color-red'>{error}</div> :
				isObj(access) && isTrue(access.ban) ? <div className='auth-blocked center color-red'><div className='t14 lh140'>Доступ ограничен, попробуйте попытку после:</div><div className='t18 lh140'>{DateTime.userFormatted(access.ban_finish)}</div></div> :
				<AuthForm refreshAccess={refresh} />}
		</div>
	)

}
export default AuthPage