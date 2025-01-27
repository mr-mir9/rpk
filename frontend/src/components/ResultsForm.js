import { useRef, useEffect, useMemo, useCallback, useState } from 'react'
import { isArr } from '../helpers/IsType'
import AnalysisForm from '../components/AnalysisForm'
import Chart from 'chart.js/auto'

import { ReactComponent as ArrowLeftSvg } from '../icons/ArrowLeft.svg'


function format(value){
	return String(parseInt(parseFloat(value)*100)/100).replace(/\./, ',')
}


function ResultsForm({ resultData, setResult }){


	const initedRef = useRef({ t:false, nu:false })
	useEffect(() => {
		if(initedRef.current.t) initedRef.current.t.destroy()

		const labels = []
		const data = []
		if(isArr(resultData.points)){
			for(const point of resultData.points){
				labels.push(`${point.l} м`)
				data.push(point.t)
			}
		}

		const ctx = document.getElementById('t_graph')
		initedRef.current.t = new Chart(ctx, {
			type:'line',
			data:{
				labels,
				datasets:[
					{
						label:'T',
						data
					}
				]
			},
			options:{
				responsive:true,
				plugins:{
					legend:{ display:false },
					tooltip:{
						callbacks:{
							label: context => {
								let label = context.dataset.label || ''
								if(label) label += ': '
								if(context.parsed.y !== null) label += `${format(context.parsed.y)} °C`
								return label
							}
						}
					}
				},
				scales:{
					x:{
						title:{
							display:true,
							text:'Координата по длине канала, м'
						}
					},
					y:{
						title:{
							display:true,
							text:'Температура материала, °C'
						}
					}
				}
			}
		})
	}, [initedRef, resultData])

	useEffect(() => {
		if(initedRef.current.nu) initedRef.current.nu.destroy()

		const labels = []
		const data = []
		if(isArr(resultData.points)){
			for(const point of resultData.points){
				labels.push(`${point.l} м`)
				data.push(point.nu)
			}
		}

		const ctx = document.getElementById('nu_graph')
		initedRef.current.nu = new Chart(ctx, {
			type:'line',
			data:{
				labels,
				datasets:[
					{
						label:'η',
						data
					}
				]
			},
			options:{
				responsive:true,
				plugins:{
					legend:{ display:false },
					tooltip:{
						callbacks:{
							label: context => {
								let label = context.dataset.label || ''
								if(label) label += ': '
								if(context.parsed.y !== null) label += `${format(context.parsed.y)} Па*с`
								return label
							}
						}
					}
				},
				scales:{
					x:{
						title:{
							display:true,
							text:'Координата по длине канала, м'
						}
					},
					y:{
						title:{
							display:true,
							text:'Вязкость материала, Па*с'
						}
					}
				}
			}
		})
	}, [initedRef, resultData])


	const tableContent = useMemo(() => {
		const result = []
		if(!isArr(resultData.points)) return result
		for(const point of resultData.points) result.push(<div className='calc-table__row' key={point.l}><div>{format(point.l)}</div><div>{format(point.t)}</div><div>{format(point.nu)}</div></div>)
		return result
	}, [resultData])


	const backHandler = useCallback(e => {
		e.preventDefault()
		setResult(null)
	}, [setResult])


	const [showAnalysis, setShowAnalysis] = useState(false)


	return (
		<div className='input-page'>
			<div className='input-page__logo m18 lh140 color-blue'><div className='center' style={{ width:'100%' }}>Результаты расчета</div><div className='input-page__back color-description pointer' onClick={backHandler}><ArrowLeftSvg /><div>Назад</div></div></div>
			<div className='input-page__content'>
				<div className='input-page__container'>
					<div className='m16 center'>Таблица данных</div>
					<div className='calc-table t16'>
						<div className='calc-table__head color-blue'>
							<div>Координата по длине канала, м</div>
							<div>Температура, °C</div>
							<div>Вязкость, Па*с</div>
						</div>
						<div className='calc-table__content'>{tableContent}</div>
					</div>
					<div className='res-container t16'>
						<div>Производительность: {format(resultData.q)} кг/ч</div>
						<div>Температура: {format(resultData.t)} °C</div>
						<div>Вязкость: {format(resultData.nu)} Па*с</div>
					</div>
					<div className='res-container t16'>
						<div>Затраченное время: {parseInt(resultData.time)} мкс</div>
						<div>Затраченная память: {format(resultData.memory)} МБ</div>
						<div>Количество операций: {parseInt(resultData.operations)}</div>
					</div>
				</div>
				<div className='input-page__container'>
					<div className='m16 center'>2D графики</div>
					<canvas id='t_graph' className='graph' />
					<canvas id='nu_graph' className='graph' />
					<form method='post' target='_blank' className='res-save' action={`${process.env.REACT_APP_API}/v1/save`}>
						<input type='hidden' value={JSON.stringify(resultData)} name='data' />
						<button type='submit' className='btn blue'>Сохранить отчет</button>
						{showAnalysis ? <div className='t14 color-red btn-show-analysis center pointer' onClick={() => setShowAnalysis(false)}>Скрыть вычислительный эксперимент</div> : <div className='t14 color-blue btn-show-analysis center pointer'  onClick={() => setShowAnalysis(true)}>Показать вычислительный эксперимент</div>}
					</form>
				</div>
				{showAnalysis ? <AnalysisForm resultData={resultData} /> : null}
			</div>
		</div>
	)

}
export default ResultsForm