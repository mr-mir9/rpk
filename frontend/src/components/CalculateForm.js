import { useMemo, useState, useLayoutEffect, useCallback, useEffect } from 'react'
import { isStr, isArr } from '../helpers/IsType'
import { useApi, parseNetworkError } from '../lib/Api'
import { formatNum } from '../helpers/Helpers'
import Select, { Option } from '../helpers/Select'
import Field from '../helpers/Field'

import { ReactComponent as LongArrowRightSvg } from '../icons/LongArrowRight.svg'
import { ReactComponent as AlertTriangleSvg } from '../icons/AlertTriangle.svg'


function CalculateForm({ materials, setResult }){

	const api = useApi()


	const initialMaterialId = useMemo(() => {
		if(!isArr(materials) || !materials.length) return null
		return materials[0].id
	}, [materials])

	const [material, setMaterial] = useState(initialMaterialId)

	const materialsOptions = useMemo(() => {
		const result = []
		for(const item of materials) result.push(<Option key={item.id} value={item.id} selected={material===item.id}>{item.name}</Option>)
		return result
	}, [materials, material])

	const [p, setP] = useState('')
	const [c, setC] = useState('')
	const [t0, setT0] = useState('')

	const [m0, setM0] = useState('')
	const [b, setB] = useState('')
	const [tr, setTr] = useState('')
	const [n, setN] = useState('')
	const [au, setAu] = useState('')

	const [z, setZ] = useState('0,1')

	useLayoutEffect(() => {
		const setEmpty = () => {
			setP('')
			setC('')
			setT0('')
			setM0('')
			setB('')
			setTr('')
			setN('')
			setAu('')
		}

		if(!isArr(materials) || !materials.length){
			setEmpty()
			return;
		}

		const item = materials.find(el => el.id === material)
		if(!item) {
			setEmpty()
			return;
		}

		setP(formatNum(item.prop_p))
		setC(formatNum(item.prop_c))
		setT0(formatNum(item.prop_t0))
		setM0(formatNum(item.prop_m0))
		setB(formatNum(item.prop_b))
		setTr(formatNum(item.prop_tr))
		setN(formatNum(item.prop_n))
		setAu(formatNum(item.prop_au))
	}, [materials, material])


	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)


	const [l, setL] = useState('8,3')
	const [w, setW] = useState('0,25')
	const [h, setH] = useState('0,005')

	const [vu, setVu] = useState('1,7')
	const [tu, setTu] = useState('195')


	useEffect(() => { setError(null) }, [l, w, h, vu, tu, material, p, c, t0, m0, b, tr, n, au])


	const submitHandler = useCallback(e => {
		e.preventDefault()

		setLoading(true)

		const requestBody = { p, c, t0, m0, b, tr, n, au, z, l, w, h, vu, tu }
		api.calculate(requestBody)
		.then(result => {
			const item = materials.find(el => el.id === material)
			result.material_name = item.name
			result.input = requestBody
			setResult(result)
		})
		.catch(e => parseNetworkError(e, null, setError))
		.finally(() => setLoading(false))
	}, [setResult, api, p, c, t0, m0, b, tr, n, au, z, l, w, h, vu, tu, materials, material])

	const disabled = useMemo(() => {
		if(loading) return true
		if(!isStr(material) || !material.length) return true
		return false
	}, [loading, material])


	return (
		<form className='input-page__content' onSubmit={submitHandler}>
			{isStr(error) && error.length ? (
				<div className='input-page__container-error'>
					<div className='form-error t14 lh120'>
						<AlertTriangleSvg />
						<div>{error}</div>
					</div>
				</div>
			) : null}
			<div className='input-page__containers'>
				<div className='input-page__container'>
					<Select label='Материал' onChange={setMaterial}>{materialsOptions}</Select>
				</div>
				<div className='input-page__container'>
					<div className='input-page__group'>
						<div className='m16 color-blue'>Параметры свойств объекта</div>
						<div className='input-page__group-content'>
							<div className='input-page__field'><Field label='Плотность' value={p} disabled={true} /><div className='t16'>кг/м<sup>3</sup></div></div>
							<div className='input-page__field'><Field label='Удельная теплоемкость' value={c} disabled={true} /><div className='t16'>Дж/(кг⋅°C)</div></div>
							<div className='input-page__field'><Field label='Температура плавления' value={t0} disabled={true} /><div className='t16'>°C</div></div>
							<div className='input-page__warning t12 lh140'><AlertTriangleSvg /><div>Установлены параметры для выбранного материала. Если требуется произвести расчет с другими данными, попросите у администратора изменить существующий или добавить новый материал</div></div>
						</div>
					</div>
				</div>
				<div className='input-page__container'>
					<div className='input-page__group'>
						<div className='m16 color-blue'>Эмпирические коэффициенты математической модели</div>
						<div className='input-page__group-content'>
							<div className='input-page__field'><Field label='Коэффициент консистенции' value={m0} disabled={true} /><div className='t16'>Па⋅с^n</div></div>
							<div className='input-page__field'><Field label='Температурный коэффициент вязкости материала' value={b} disabled={true} /><div className='t16'>1/°C</div></div>
							<div className='input-page__field'><Field label='Температура приведения' value={tr} disabled={true} /><div className='t16'>°C</div></div>
							<div className='input-page__field'><Field label='Индекс течения материала' value={n} disabled={true} /><div className='t16'>–</div></div>
							<div className='input-page__field'><Field label='Коэффициент теплоотдачи' value={au} disabled={true} /><div className='t16'>Вт/(м<sup>2</sup>⋅°C)</div></div>
							<div className='input-page__warning t12 lh140'><AlertTriangleSvg /><div>Установлены параметры для выбранного материала. Если требуется произвести расчет с другими данными, попросите у администратора изменить существующий или добавить новый материал</div></div>
						</div>
					</div>
				</div>
			</div>
			<div className='input-page__containers'>
				<div className='input-page__container'>
					<div className='input-page__group'>
						<div className='m16 color-blue'>Геометрические параметры канала</div>
						<div className='input-page__group-content'>
							<div className='input-page__field'><Field label='Длина' value={l} setValue={setL} disabled={loading} pattern={/^-?(([0-9]{0,9})(,[0-9]{0,3})?)?$/} replace={[[/\./, ',']]} /><div className='t16'>м</div></div>
							<div className='input-page__field'><Field label='Ширина' value={w} setValue={setW} disabled={loading} pattern={/^-?(([0-9]{0,9})(,[0-9]{0,3})?)?$/} /><div className='t16'>м</div></div>
							<div className='input-page__field'><Field label='Высота' value={h} setValue={setH} disabled={loading} pattern={/^-?(([0-9]{0,9})(,[0-9]{0,3})?)?$/} /><div className='t16'>м</div></div>
						</div>
					</div>
				</div>
				<div className='input-page__container'>
					<div className='input-page__group'>
						<div className='m16 color-blue'>Режимные параметры процесса</div>
						<div className='input-page__group-content'>
							<div className='input-page__field'><Field label='Скорость крышки' value={vu} setValue={setVu} disabled={loading} pattern={/^-?(([0-9]{0,9})(,[0-9]{0,3})?)?$/} /><div className='t16'>м/с</div></div>
							<div className='input-page__field'><Field label='Температура крышки' value={tu} setValue={setTu} disabled={loading} pattern={/^-?(([0-9]{0,9})(,[0-9]{0,3})?)?$/} /><div className='t16'>°C</div></div>
						</div>
					</div>
				</div>
				<div className='input-page__container'>
					<div className='input-page__group'>
						<div className='m16 color-blue'>Параметры метода решения</div>
						<div className='input-page__group-content'>
							<div className='input-page__field'><Field label='Скорость крышки' value={z} setValue={setZ} disabled={loading} pattern={/^-?(([0-9]{0,9})(,[0-9]{0,3})?)?$/} /><div className='t16'>м</div></div>
						</div>
					</div>
				</div>
				<div className='input-page__container'>
					<button className='btn blue' type='submit' disabled={disabled}>{loading ? 'Происходит расчет' : <><div>Произвести рассчет</div><LongArrowRightSvg className='btn-ico__right' /></>}</button>
				</div>
			</div>
		</form>
	)

}
export default CalculateForm