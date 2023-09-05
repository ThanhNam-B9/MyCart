import { ToastContainer } from 'react-toastify'
import './App.css'
import useRouterElements from './useRouteElements'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const routerElements = useRouterElements()

  return (
    <div>
      {routerElements}
      <ToastContainer />
    </div>
  )
}

export default App
