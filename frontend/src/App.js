import { useMemo } from 'react'
import Router from './lib/Router'
import Modal from './lib/Modal'
import User from './lib/User'


function App(){

    const router = useMemo(() => <Router />, [])
    const modal = useMemo(() => <Modal>{router}</Modal>, [router])
    const user = useMemo(() => <User>{modal}</User>, [modal])

    return user

}

export default App