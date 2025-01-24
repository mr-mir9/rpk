import AuthForm from '../components/AuthForm'


function AuthPage(){

	return (
		<div className='auth-page'>
			<div className='auth-page__logo logo m18 lh120'>
				<div />
				<div>Исследование неизотермического течения аномально-вязких материалов</div>
			</div>
			<AuthForm />
		</div>
	)

}
export default AuthPage