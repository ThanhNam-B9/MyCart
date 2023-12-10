import { Link } from 'react-router-dom'
import Popover from '../Popoper'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/appContext'
import path from 'src/constants/path'
import { useMutation } from '@tanstack/react-query'
import authApi from 'src/api/auth.api'
import { purchasesStatus } from 'src/constants/purchase'
import { queryClient } from 'src/main'

function NavHeader() {
  const { isAuthenticated, setIsAuthenticated, profile } = useContext(AppContext)
  const logoutAccountMutation = useMutation({
    mutationFn: authApi.logoutAccount,
    onSuccess: () => {
      setIsAuthenticated(false)
      queryClient.removeQueries({ queryKey: ['listCart', { status: purchasesStatus.inCart }], exact: true })
    }
  })
  const handleLogoutWithAccount = () => {
    logoutAccountMutation.mutate()
  }
  return (
    <div className='flex justify-end text-white text-sm '>
      <Popover
        className='flex items-center py-1 mr-4 hover:text-gray-300 cursor-pointer ml-6'
        renderPopover={
          <div className='bg-white relative shadow-md rounded-sm border border-gray-200'>
            <div className='flex flex-col '>
              <button className='py-2 px-3 pr-28 hover:text-orange hover:bg-slate-100'>Tiếng việt</button>
              <button className='py-2 px-3 pr-28 hover:text-orange hover:bg-slate-100'>Tiếng Anh</button>
            </div>
          </div>
        }
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-5 h-5'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
          />
        </svg>
        <span className='mx-1'>Tiếng việt</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-5 h-5'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
        </svg>
      </Popover>
      {isAuthenticated && (
        <Popover
          className='flex items-center py-1 mr-4 hover:text-gray-300 cursor-pointer'
          renderPopover={
            <div className='bg-white relative shadow-md rounded-sm border border-gray-200'>
              <div className='flex flex-col text-start'>
                <Link to='/' className='py-2 px-3 text-sm text-start hover:text-orange hover:bg-slate-100'>
                  Tài khoản của tôi
                </Link>
                <Link to='/' className='py-2 px-3 text-sm text-start hover:text-orange hover:bg-slate-100'>
                  Đơn hàng
                </Link>
                <button
                  onClick={handleLogoutWithAccount}
                  className='py-2 px-3 text-sm text-start hover:text-orange hover:bg-slate-100'
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          }
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z'
            />
          </svg>
          <span className='ml-1'>{profile?.email}</span>
        </Popover>
      )}
      {!isAuthenticated && (
        <div className='flex items-center gap-2'>
          <Link to={path.register} className='capitalize  text-white hover:opacity-90'>
            Đăng kí
          </Link>
          <div className='border-r-[1px] border-r-white/40 h-4 ' />
          <Link to={path.login} className='capitalize  text-white hover:opacity-90'>
            Đăng nhập
          </Link>
        </div>
      )}
    </div>
  )
}
export default NavHeader
