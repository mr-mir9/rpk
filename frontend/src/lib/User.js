import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { isObj } from '../helpers/IsType'


const UserContext = createContext(null)

function User({ children }){

	const [user, setUser] = useState(null)
	const [session, setSession] = useState(null)
	const loginHandler = useCallback(session => {
		if(!isObj(session) || session.object !== 'session') return;
		setSession(session.token)
		setUser(session.user)
	}, [])
	const logoutHandler = useCallback(() => {
		setSession(null)
		setUser(null)
	}, [])
	const content = useMemo(() => ({ user, setUser, session, loginHandler, logoutHandler }), [user, session, loginHandler, logoutHandler])

	return <UserContext.Provider value={content}>{children}</UserContext.Provider>
}

function useUser(){
	return useContext(UserContext)
}

export default User
export { useUser }