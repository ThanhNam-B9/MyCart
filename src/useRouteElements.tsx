import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import ProductList from './pages/PoductList'
import Login from './pages/Login'
import Register from './pages/Register/Register'
import RegisterLayout from './layout/RegisterLayout'
import MainLayout from './layout/MainLayout/MainLayout'
import { useContext } from 'react'
import { AppContext } from './contexts/appContext'
import path from './constants/path'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import CartLayout from './layout/CartLayout'
import Profile from './pages/User/pages/Profile'
import UserLayout from './pages/User/layout/UserLayout'
import ChangePassword from './pages/User/pages/ChangePassword'
import HistoryPurchases from './pages/User/pages/HistoryPurchases'
import NotFound from './pages/NotFound'

export default function useRouterElements() {
  function ProtectedRouter() {
    const { isAuthenticated } = useContext(AppContext)
    return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
  }
  function RejectedRouter() {
    const { isAuthenticated } = useContext(AppContext)
    return !isAuthenticated ? <Outlet /> : <Navigate to={path.home} />
  }
  const routeElements = useRoutes([
    {
      path: '',
      element: <RejectedRouter />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          )
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          )
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
              <Cart />
            </CartLayout>
          )
        },
        {
          path: path.user,
          element: (
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),
          children: [
            {
              path: path.profile,

              element: <Profile />
            },
            {
              path: path.changePassword,
              element: <ChangePassword />
            },
            {
              path: path.historyPurshases,
              element: <HistoryPurchases />
            }
          ]
        },
        {
          path: path.productDetail,
          element: (
            <MainLayout>
              <ProductDetail />
            </MainLayout>
          )
        }
      ]
    },

    {
      path: '',
      index: true,
      element: (
        <MainLayout>
          <ProductList />
        </MainLayout>
      )
    },
    {
      path: '*',
      element: (
        <MainLayout>
          <NotFound />
        </MainLayout>
      )
    }
  ])

  return routeElements
}
