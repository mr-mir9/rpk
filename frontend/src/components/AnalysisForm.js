import { useMemo, useRef, useEffect } from 'react'
import { isArr } from '../helpers/IsType'
import Chart from 'chart.js/auto'


function format(value){
	return String(parseInt(parseFloat(value)*100)/100).replace(/\./, ',')
}


function AnalysisForm({ resultData }){

	const tableContent = useMemo(() => {
		const result = []
		if(!isArr(resultData.analysis)) return result
		for(const point of resultData.analysis) result.push(<div className='analysis-table__row' key={point.vu}><div>{format(point.vu)}</div><div>{format(point.q)}</div><div>{format(point.t)}</div><div>{format(point.nu)}</div></div>)
		return result
	}, [resultData])


	const initedRef = useRef({ q:false, t:false, nu:false })
	useEffect(() => {
		if(initedRef.current.q) initedRef.current.q.destroy()

		const labels = []
		const data = []
		if(isArr(resultData.analysis)){
			for(const point of resultData.analysis){
				labels.push(`${point.vu} м/c`)
				data.push(point.q)
			}
		}

		const ctx = document.getElementById('an_q_graph')
		ctx.height = 250
		initedRef.current.q = new Chart(ctx, {
			type:'line',
			data:{
				labels,
				datasets:[
					{
						label:'q',
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
								if(context.parsed.y !== null) label += `${format(context.parsed.y)} кг/ч`
								return label
							}
						}
					}
				},
				scales:{
					x:{
						title:{
							display:true,
							text:'Скорость крышки канала, м/с'
						}
					},
					y:{
						title:{
							display:true,
							text:'Производительность канала, кг/ч'
						}
					}
				}
			}
		})
	}, [initedRef, resultData])

	useEffect(() => {
		if(initedRef.current.t) initedRef.current.t.destroy()

		const labels = []
		const data = []
		if(isArr(resultData.analysis)){
			for(const point of resultData.analysis){
				labels.push(`${point.vu} м/c`)
				data.push(point.t)
			}
		}

		const ctx = document.getElementById('an_t_graph')
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
							text:'Скорость крышки канала, м/с'
						}
					},
					y:{
						title:{
							display:true,
							text:'Температура продукта, °C'
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
		if(isArr(resultData.analysis)){
			for(const point of resultData.analysis){
				labels.push(`${point.vu} м/c`)
				data.push(point.nu)
			}
		}

		const ctx = document.getElementById('an_nu_graph')
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
							text:'Скорость крышки канала, м/с'
						}
					},
					y:{
						title:{
							display:true,
							text:'Вязкость продукта, Па*с'
						}
					}
				}
			}
		})
	}, [initedRef, resultData])

	
	return (
		<>
			<div className='input-page__container input-page__container-title'>
				<div className='m16 center'>Влияние скорости крышки канала на производительность канала, температуру и вязкость продукта</div>
			</div>
			<div className='input-page__container'>
				<div className='m16 center'>Таблица данных</div>
				<div className='analysis-table t14'>
					<div className='analysis-table__head color-blue'>
						<div>Скорость крышки канала, м/с</div>
						<div>Производи-тельность канала, кг/ч</div>
						<div>Температура продукта, °C</div>
						<div>Вязкость продукта, Па*с</div>
					</div>
					<div className='analysis-table__content'>{tableContent}</div>
				</div>
			</div>
			<div className='input-page__container'>
				<canvas id='an_q_graph' className='graph' />
				<canvas id='an_t_graph' className='graph' />
				<canvas id='an_nu_graph' className='graph' />
			</div>
		</>
	)

}
export default AnalysisForm