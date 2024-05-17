import { ToastContainer } from 'react-toastify'
import './App.css'
import useRouterElements from './useRouteElements'
import 'react-toastify/dist/ReactToastify.css'
import { useContext, useEffect } from 'react'
import { LocalStorageEventTarget } from './utils/auth'
import { AppContext } from './contexts/appContext'

function App() {
  const routerElements = useRouterElements()
  console.log('APP')

  const { reset } = useContext(AppContext)
  useEffect(() => {
    LocalStorageEventTarget.addEventListener('removeAuthLS', reset)
    return () => {
      LocalStorageEventTarget.removeEventListener('removeAuthLS', reset)
    }
  }, [reset])
  return (
    <div>
      {routerElements}
      <ToastContainer />
    </div>
  )
}

export default App
