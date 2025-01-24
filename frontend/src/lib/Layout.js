import { Outlet } from 'react-router'


function Layout(){

	return (
		<div className='page'>
			<div className='page-content'>
				<Outlet />
			</div>
			<div className='page-footer'>
				<div>
					<div className='page-footer__university t12'>
						<div />
						<div className='page-footer__university-text'>
							<div>Санкт-Петербургский государственный</div>
							<div>ТЕХНОЛОГИЧЕСКИЙ ИНСТИТУТ</div>
							<div>(технический университет)</div>
						</div>
					</div>
					<div className='page-footer__authors t12'>
						<div className='page-footer__author'>
							<div className='color-description'>Руководитель разработки,</div>
							<div className='color-description'>кандидат технических наук, доцент</div>
							<div>Андрей Николаевич Полосин</div>
						</div>
						<div className='page-footer__author'>
							<div className='color-description'>Разработал студент 413 гурппы</div>
							<div>Дмитрий Владимирович</div>
							<div>Владимиров</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)

}
export default Layout