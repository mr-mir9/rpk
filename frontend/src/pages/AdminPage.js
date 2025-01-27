import { useCallback, useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useApi, parseNetworkError } from '../lib/Api'
import { useModal } from '../lib/Modal'
import { useUser } from '../lib/User'
import { isStr, isObj } from '../helpers/IsType'
import AdminSettings from '../components/AdminSettings'
import AdminUsers from '../components/AdminUsers'
import AdminMaterials from '../components/AdminMaterials'
import MaterialAdminModal from '../modals/MaterialAdminModal'


function AdminPage(){

	const { user, logoutHandler:logout } = useUser()
	const api = useApi()
	const modal = useModal()
	const navigate = useNavigate()
	useEffect(() => {
		if(!user || user.role !== 'admin') navigate('/', { replace: true })
	}, [user, navigate])

	const logoutHandler = useCallback(e => {
		e.preventDefault()
		logout()
		navigate('/')
	}, [logout, navigate])


	const [loading, setLoading] = useState(true)
	const [page, setPage] = useState('main')
	const [error, setError] = useState(null)
	const [data, setData] = useState(null)

	useEffect(() => {
		api.admin()
		.then(setData)
		.catch(e => parseNetworkError(e, null, setError))
		.finally(() => setLoading(false))
	}, [api])


	const setPageHandler = useCallback((e, page) => {
		e.preventDefault()
		setPage(page)
	}, [])


	const addMaterialHandler = useCallback(e => {
		e.preventDefault()
		modal.show(<MaterialAdminModal parentClassName='modal-material' />)
		.then(material => {
			if(!isObj(material) || material.object !== 'material') return;
			setData(state => ({...state, materials:[...state.materials, material]}))
		})
	}, [modal])


	return (
		<>
			<div className='header'>
				<div>
					<div className='logo m18 lh120'>
						<div />
						<div>Исследование неизотермического течения аномально-вязких материалов</div>
					</div>
					<div>
						<div className='t16 lh140'><span className='color-description'>Вы вошли как</span> Администратор</div>
						<div className='t14 lh120 color-blue pointer' onClick={logoutHandler}>Выйти из аккаунта</div>
					</div>
				</div>
			</div>
			<div className='admin-page'>
				{loading || isStr(error) ? (
					<div className='admin-page__title t18'>
						<div className='admin-page__title-text'>Панель администратора</div>
						<div className='admin-page__title-description'>{isStr(error) ? <div className='color-red'>{error}</div> : <div className='color-blue'>Получение данных с сервера...</div>}</div>
					</div>
				) : (
					<>
						<div className='admin-page__title t18'>
							<div className='admin-page__title-text'>Панель администратора</div>
							<div className={`admin-page__title-link ${page==='main' ? 'active' : ''}`} onClick={e => setPageHandler(e,'main')}>Настройки</div>
							<div className={`admin-page__title-link ${page==='users' ? 'active' : ''}`} onClick={e => setPageHandler(e,'users')}>Пользователи</div>
							<div className={`admin-page__title-link ${page==='materials' ? 'active' : ''}`} onClick={e => setPageHandler(e,'materials')}>Материалы</div>
							{page==='materials' ? <div className='btn sm blue' onClick={addMaterialHandler}>Добавить матриал</div> : null}
						</div>
						{page === 'main' ? <AdminSettings data={data} setData={setData} /> : null}
						{page === 'users' ? <AdminUsers data={data} setData={setData} /> : null}
						{page === 'materials' ? <AdminMaterials data={data} setData={setData} /> : null}
					</>
				)}
			</div>
		</>
	)

}
export default AdminPage