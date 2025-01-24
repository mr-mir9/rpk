import { useCallback, useMemo } from 'react'
import { useModal } from '../lib/Modal'
import { getRoleName } from '../lib/Api'
import { isObj, isArr } from '../helpers/IsType'
import EditUserAdminModal from '../modals/EditUserAdminModal'


function AdminUsers({ data, setData }){

	const modal = useModal()


	const editHandler = useCallback((e, user) => {
		e.preventDefault()

		modal.show(<EditUserAdminModal user={user} />)
		.then(user => {
			if(!isObj(user) || user.object !== 'user') return;
			setData(state => {
				const result = { users:[], materials:state.materials }
				for(const item of state.users){
					if(item.id === user.id) result.users.push(user)
					else result.users.push(item)
				}
				return result
			})
		})
	}, [modal, setData])


	const content = useMemo(() => {
		if(!isObj(data) || !isArr(data.users) || !data.users.length) return []

		const result = []
		for(const user of data.users){
			result.push(
				<div className='admin-page__users-row' key={user.id}>
					<div>{getRoleName(user.role)}</div>
					<div>{user.login}</div>
					<div>{user.password}</div>
					<div><div className='btn blue-outline sm' onClick={e => editHandler(e, user)}>Изменить авторизационные данные</div></div>
				</div>
			)
		}
		return result
	}, [data, editHandler])

	return (
		<div className='admin-page__users t16'>
			<div className='admin-page__users-head color-blue'>
				<div>Роль пользователя</div>
				<div>Логин</div>
				<div>Пароль</div>
				<div className='center'>Действия</div>
			</div>
			<div className='admin-page__users-content'>{content}</div>
		</div>
	)

}
export default AdminUsers