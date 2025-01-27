import { useCallback, useMemo } from 'react'
import { isObj, isArr } from '../helpers/IsType'
import { formatNum } from '../helpers/Helpers'
import { useModal } from '../lib/Modal'
import { useApi } from '../lib/Api'
import MaterialAdminModal from '../modals/MaterialAdminModal'
import ConfirmModal from '../modals/ConfirmModal'


function AdminMaterials({ data, setData }){

	const api = useApi()
	const modal = useModal()


	const editHandler = useCallback((e, material) => {
		e.preventDefault()
		modal.show(<MaterialAdminModal parentClassName='modal-material' material={material} />)
		.then(material => {
			if(!isObj(material) || material.object !== 'material') return;

			setData(state => {
				const result = { users:state.users, materials:[] }
				for(const item of state.materials){
					if(item.id === material.id) result.materials.push(material)
					else result.materials.push(item)
				}
				return result
			})
		})
	}, [modal, setData])


	const deleteHandler = useCallback((e, material) => {
		e.preventDefault()
		modal.show(<ConfirmModal parentClassName='modal-confirm' text={`Вы уверены, что хотите удалить материал "${material.name}"? Отменить это действие будет невозможно`} />)
		.then(confirmed => {
			if(confirmed !== 'confirmed') return;
			setData(state => {
				const result = { users:state.users, materials:[] }
				for(const item of state.materials){
					if(item.id === material.id) continue;
					result.materials.push(item)
				}
				return result
			})

			api.deleteMaterial(material.id)
			.catch(e => {})
		})
	}, [modal, api, setData])


	const content = useMemo(() => {
		if(!isObj(data) || !isArr(data.materials) || !data.materials.length) return <div className='t16 center'>Материалы не найдены в базе данных</div>

		const result = []
		for(const material of data.materials){
			result.push(
				<div className='admin-page__material' key={material.id}>
					<div>
						<div className='t14 color-description lh140'>Название</div>
						<div className='t18 color-blue lh140'>{material.name}</div>
						<div className='admin-page__material-group'>
							<div className='m16'>Параметры свойств объекта</div>
							<div className='admin-page__material-line t16'>
								<div>Плотность [кг/м<sup>3</sup>]</div>
								<div />
								<div className='m16'>{formatNum(material.prop_p)}</div>
							</div>
							<div className='admin-page__material-line t16'>
								<div>Удельная теплоемкость [Дж/(кг⋅°C)]</div>
								<div />
								<div className='m16'>{formatNum(material.prop_c)}</div>
							</div>
							<div className='admin-page__material-line t16'>
								<div>Температура плавления [°C]</div>
								<div />
								<div className='m16'>{formatNum(material.prop_t0)}</div>
							</div>
						</div>
						<div className='admin-page__material-group'>
							<div className='m16'>Эмпирические коэффициенты математической модели</div>
							<div className='admin-page__material-line t16'>
								<div>Коэффициент консистенции [Па⋅с<sup>n</sup>]</div>
								<div />
								<div className='m16'>{formatNum(material.prop_m0)}</div>
							</div>
							<div className='admin-page__material-line t16 lh120'>
								<div>Температурный коэффициент вязкости материала [1/°C]</div>
								<div />
								<div className='m16'>{formatNum(material.prop_b)}</div>
							</div>
							<div className='admin-page__material-line t16'>
								<div>Температура приведения [°C]</div>
								<div />
								<div className='m16'>{formatNum(material.prop_tr)}</div>
							</div>
							<div className='admin-page__material-line t16'>
								<div>Индекс течения материала</div>
								<div />
								<div className='m16'>{formatNum(material.prop_n)}</div>
							</div>
							<div className='admin-page__material-line t16'>
								<div>Коэффициент теплоотдачи [Вт/(м<sup>2</sup>⋅°C)]</div>
								<div />
								<div className='m16'>{formatNum(material.prop_au)}</div>
							</div>
						</div>
						<div className='admin-page__material-btns'>
							<div className='btn blue-outline sm' onClick={e => editHandler(e, material)}>Изменить</div>
							<div className='btn red-outline sm' onClick={e => deleteHandler(e, material)}>Удалить</div>
						</div>
					</div>
				</div>
			)
		}
		return result
	}, [data, editHandler, deleteHandler])

	return (
		<div className='admin-page__materials'>{content}</div>
	)

}
export default AdminMaterials