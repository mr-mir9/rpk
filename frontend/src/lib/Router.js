import { BrowserRouter, Routes, Route } from 'react-router'
import Layout from '../lib/Layout'
import AuthPage from '../pages/AuthPage'
import CalculatePage from '../pages/CalculatePage'
import AdminPage from '../pages/AdminPage'


function Router(){

	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />} >
					<Route path='/' element={<AuthPage />} />
					<Route path='/calculate' element={<CalculatePage />} />
					<Route path='/admin' element={<AdminPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	)

}
export default Router