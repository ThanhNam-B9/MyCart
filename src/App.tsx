import { ToastContainer } from 'react-toastify'
import './App.css'
import useRouterElements from './useRouteElements'
import 'react-toastify/dist/ReactToastify.css'
import { useContext, useEffect } from 'react'
import { LocalStorageEventTarget } from './utils/auth'
import { AppContext } from './contexts/appContext'

function App() {
  const routerElements = useRouterElements()

  const { restore } = useContext(AppContext)
  useEffect(() => {
    LocalStorageEventTarget.addEventListener('removeAuthLS', restore)
    return () => {
      LocalStorageEventTarget.removeEventListener('removeAuthLS', restore)
    }
  }, [restore])
  return (
    <div>
      {routerElements}
      <ToastContainer />
    </div>
  )
}

export default App
