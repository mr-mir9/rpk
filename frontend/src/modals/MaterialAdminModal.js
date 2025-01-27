import { useCallback, useState, useMemo } from 'react'
import { useApi, parseNetworkError } from '../lib/Api'
import { isTrue } from '../helpers/IsType'
import { formatNum } from '../helpers/Helpers'
import { isObj, isStr } from '../helpers/IsType'
import Field from '../helpers/Field'
import Validators from '../helpers/Validators'

import { ReactComponent as CloseSvg } from '../icons/Close.svg'
import { ReactComponent as AlertTriangleSvg } from '../icons/AlertTriangle.svg'


function MaterialAdminModal({ callback, material }){

	const api = useApi()


	const closeHandler = useCallback(e => {
		e.preventDefault()
		callback(null)
	}, [callback])


	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)


	const [savedName, savedP, savedC, savedT0, savedM0, savedB, savedTr, savedN, savedAu] = useMemo(() => {
		if(isObj(material)) return [material.name, material.prop_p, material.prop_c, material.prop_t0, material.prop_m0, material.prop_b, material.prop_tr, material.prop_n, material.prop_au]
		else return ['', '', '', '', '', '', '', '', '']
	}, [material])


	const [name, setName] = useState(savedName)
	const [nameErr, setNameErr] = useState(null)
	const [nameValid, setNameValid] = useState(true)
	const nameValidators = useMemo(() => [Validators.required(true)], [])

	const [p, setP] = useState(formatNum(savedP))
	const [c, setC] = useState(formatNum(savedC))
	const [t0, setT0] = useState(formatNum(savedT0))

	const [m0, setM0] = useState(formatNum(savedM0))
	const [b, setB] = useState(formatNum(savedB))
	const [tr, setTr] = useState(formatNum(savedTr))
	const [n, setN] = useState(formatNum(savedN))
	const [au, setAu] = useState(formatNum(savedAu))


	const disabled = useMemo(() => {
		if(loading) return true
		if(!isTrue(nameValid)) return true
		return false
	}, [loading, nameValid])


	const submitHandler = useCallback(e => {
		e.preventDefault()
		setLoading(true)
		setError(null)

		const requestBody = {name, p, c, t0, m0, b, tr, n, au}

		let promise
		if(isObj(material)){
			requestBody.id = material.id
			promise = api.editMaterial(requestBody)
		}else promise = api.addMaterial(requestBody)

		promise.then(callback)
		.catch(e => parseNetworkError(e, null, setError))
		.finally(() => setLoading(false))
	}, [callback, api, material, name, p, c, t0, m0, b, tr, n, au])


	return (
		<div className='modal-content'>
			<div className='modal-title'>
				<div className='m21 color-blue'>{isObj(material) ? 'Редактирование материала' : 'Добавление материала'}</div>
				<CloseSvg onClick={closeHandler} />
			</div>
			<form className='form' onSubmit={submitHandler}>
				<div className='form-field'><Field label='Название' value={name} setValue={setName} err={nameErr} setErr={setNameErr} setValid={setNameValid} validators={nameValidators} disabled={loading} /></div>
				<div className='form-field__group m16 lh120'><div>Параметры свойств объекта</div></div>
				<div className='form-field form-field__type'><Field label='Плотность' value={p} setValue={setP} disabled={loading} pattern={/^-?(([0-9]{0,9})(,[0-9]{0,3})?)?$/} replace={[[/\./, ',']]} /><div className='t16'>кг/м<sup>3</sup></div></div>
				<div className='form-field form-field__type'><Field label='Удельная теплоемкость' value={c} setValue={setC} disabled={loading} pattern={/^-?(([0-9]{0,9})(,[0-9]{0,3})?)?$/} replace={[[/\./, ',']]} /><div className='t16'>Дж/(кг⋅°C)</div></div>
				<div className='form-field form-field__type'><Field label='Температура плавления' value={t0} setValue={setT0} disabled={loading} pattern={/^-?(([0-9]{0,9})(,[0-9]{0,3})?)?$/} replace={[[/\./, ',']]} /><div className='t16'>°C</div></div>
				<div className='form-field__group m16 lh120'><div>Эмпирические коэффициенты математической модели</div></div>
				<div className='form-field form-field__type'><Field label='Коэффициент консистенции' value={m0} setValue={setM0} disabled={loading} pattern={/^-?(([0-9]{0,9})(,[0-9]{0,3})?)?$/} replace={[[/\./, ',']]} /><div className='t16'>Па⋅с<sup>n</sup></div></div>
				<div className='form-field form-field__type'><Field label='Температурный коэффициент вязкости материала' value={b} setValue={setB} disabled={loading} pattern={/^-?(([0-9]{0,9})(,[0-9]{0,3})?)?$/} replace={[[/\./, ',']]} /><div className='t16'>1/°C</div></div>
				<div className='form-field form-field__type'><Field label='Температура приведения' value={tr} setValue={setTr} disabled={loading} pattern={/^-?(([0-9]{0,9})(,[0-9]{0,3})?)?$/} replace={[[/\./, ',']]} /><div className='t16'>°C</div></div>
				<div className='form-field form-field__type'><Field label='Индекс течения материала' value={n} setValue={setN} disabled={loading} pattern={/^-?(([0-9]{0,9})(,[0-9]{0,3})?)?$/} replace={[[/\./, ',']]} /><div className='t16'>–</div></div>
				<div className='form-field form-field__type'><Field label='Коэффициент теплоотдачи' value={au} setValue={setAu} disabled={loading} pattern={/^-?(([0-9]{0,9})(,[0-9]{0,3})?)?$/} replace={[[/\./, ',']]} /><div className='t16'>Вт/(м<sup>2</sup>⋅°C)</div></div>
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
export default MaterialAdminModal