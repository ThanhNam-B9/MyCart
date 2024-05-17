import { Navigate, Outlet, useRoutes } from 'react-router-dom'

import RegisterLayout from './layout/RegisterLayout'
import MainLayout from './layout/MainLayout/MainLayout'
import { Suspense, lazy, useContext } from 'react'
import { AppContext } from './contexts/appContext'
import path from './constants/path'
import Cart from './pages/Cart'
import CartLayout from './layout/CartLayout'
import UserLayout from './pages/User/layout/UserLayout'
// import ProductList from './pages/PoductList'
// import Login from './pages/Login'
// import Profile from './pages/User/pages/Profile'
// import Register from './pages/Register'
// import ProductDetail from './pages/ProductDetail'
// import ChangePassword from './pages/User/pages/ChangePassword'
// import HistoryPurchases from './pages/User/pages/HistoryPurchases'
// import NotFound from './pages/NotFound'

function ProtectedRouter() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
}
function RejectedRouter() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to={path.home} />
}
//Đưa ProtectedRouter và RejectedRouter ra useRouterElements, nếu  đưa vào thì mỗi lần hook nó chạy lại thì component sẽ bị khai báo mới lại.
export default function useRouterElements() {
  const Login = lazy(() => import('./pages/Login'))
  const ProductList = lazy(() => import('./pages/PoductList'))
  const Profile = lazy(() => import('./pages/User/pages/Profile'))
  const Register = lazy(() => import('./pages/Register'))
  const ProductDetail = lazy(() => import('./pages/ProductDetail'))
  const ChangePassword = lazy(() => import('./pages/User/pages/ChangePassword'))
  const HistoryPurchases = lazy(() => import('./pages/User/pages/HistoryPurchases'))
  const NotFound = lazy(() => import('./pages/NotFound'))

  const routeElements = useRoutes([
    {
      path: '',
      element: <RejectedRouter />,
      children: [
        {
          path: '',
          element: <RegisterLayout />,
          children: [
            {
              path: path.login,
              element: (
                <Suspense fallback={<div>loading...</div>}>
                  <Login />
                </Suspense>
              )
            },
            {
              path: path.register,
              element: (
                <Suspense>
                  <Register />
                </Suspense>
              )
            }
          ]
        }
      ]
    },
    {
      path: '',
      element: <ProtectedRouter />,
      children: [
        {
          path: path.cart,
          element: (
            <CartLayout>
              <Suspense>
                <Cart />
              </Suspense>
            </CartLayout>
          )
        },
        {
          path: path.user,
          element: <MainLayout />,
          children: [
            {
              path: '',
              element: <UserLayout />,
              children: [
                {
                  path: path.profile,

                  element: (
                    <Suspense>
                      <Profile />
                    </Suspense>
                  )
                },
                {
                  path: path.changePassword,
                  element: (
                    <Suspense>
                      <ChangePassword />
                    </Suspense>
                  )
                },
                {
                  path: path.historyPurshases,
                  element: (
                    <Suspense>
                      <HistoryPurchases />
                    </Suspense>
                  )
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '',
      element: <MainLayout />,
      children: [
        {
          path: path.productDetail,
          element: (
            <Suspense>
              <ProductDetail />
            </Suspense>
          )
        },
        {
          path: '',
          index: true,
          element: (
            <Suspense>
              <ProductList />
            </Suspense>
          )
        },
        {
          path: '*',
          element: (
            <Suspense>
              <NotFound />
            </Suspense>
          )
        }
      ]
    }
  ])

  return routeElements
}
