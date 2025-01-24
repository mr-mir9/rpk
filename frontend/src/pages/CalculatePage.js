import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { isObj, isStr } from '../helpers/IsType'
import { useUser } from '../lib/User'
import { useApi, parseNetworkError } from '../lib/Api'
import CalculateForm from '../components/CalculateForm'
import ResultsForm from '../components/ResultsForm'


function CalculatePage(){

	const { user, logoutHandler:logout } = useUser()
	const api = useApi()
	const navigate = useNavigate()
	useEffect(() => {
		if(!user || user.role !== 'user') navigate('/', { replace: true })
	}, [user, navigate])

	const logoutHandler = useCallback(e => {
		e.preventDefault()
		logout()
		navigate('/')
	}, [logout, navigate])


	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [materials, setMaterials] = useState([])

	useEffect(() => {
		if(!user || user.role !== 'user') return;
		setLoading(true)

		api.getMaterials()
		.then(setMaterials)
		.catch(e => parseNetworkError(e, null, setError))
		.finally(() => setLoading(false))
	}, [api, user])


	const [result, setResult] = useState(null)


	if(!user || user.role !== 'user') return null
	return (
		<>
			<div className='header'>
				<div>
					<div className='logo m18 lh120'>
						<div />
						<div>Исследование неизотермического течения аномально-вязких материалов</div>
					</div>
					<div>
						<div className='t16 lh140'><span className='color-description'>Вы вошли как</span> Исследователь</div>
						<div className='t14 lh120 color-blue pointer' onClick={logoutHandler}>Выйти из аккаунта</div>
					</div>
				</div>
			</div>
			{isObj(result) ? <ResultsForm resultData={result} setResult={setResult} /> : (
				<div className='input-page'>
					<div className='input-page__logo m18 lh140 color-blue'>Ввод данных</div>
					{loading || isStr(error) ? <div className='input-page__loader m16'>{isStr(error) ? <div className='color-red'>{error}</div> : <div className='color-blue'>Загрузка данных о материалах...</div>}</div> : <CalculateForm materials={materials} setResult={setResult} />}
				</div>
			)}
		</>
	)

}
export default CalculatePage