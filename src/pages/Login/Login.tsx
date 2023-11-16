import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import authApi from 'src/api/auth.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/appContext'
import { ErrorResponseApi } from 'src/types/utils.type'
import {
  Schema,
  //  getRules,
  schema
} from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FormData = Omit<Schema, 'repassword'>
const loginSchema = schema.omit(['repassword', 'price_min', 'price_max'])

export default function Login() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const {
    register,
    handleSubmit,
    // getValues,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })
  // const rules = getRules(getValues)
  const loginAccountMutition = useMutation({
    mutationFn: (body: FormData) => authApi.loginAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    const body = data
    console.log('body', body)
    loginAccountMutition.mutate(body, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponseApi<FormData>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })
  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 lg:grid-cols-5 lg:py-12 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form onSubmit={onSubmit} className='p-10 rounded bg-white shadow-sm' noValidate>
              <div className='text-2xl'>Đăng nhập</div>
              <Input
                type='email'
                autoComplete='on'
                placeholder='Email'
                name='email'
                // rules={rules.email}
                className='mt-8'
                messageError={errors.email?.message}
                register={register}
              />
              <Input
                type='password'
                autoComplete='on'
                placeholder='Mật khẩu'
                name='password'
                // rules={rules.password}
                className='mt-2'
                messageError={errors.password?.message}
                register={register}
              />
              <div className='mt-2'>
                <Button
                  type='submit'
                  className='w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600 flex items-center justify-center'
                  isLoading={loginAccountMutition.isLoading}
                  disabled={loginAccountMutition.isLoading}
                >
                  Đăng nhập
                </Button>
              </div>
              <div className='mt-8'>
                <div className='flex items-center justify-center'>
                  <span className='text-slate-400 mr-1'>Bạn chưa có tài khoản? </span>
                  <Link className='text-red-400' to={path.register}>
                    Đăng ký
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
