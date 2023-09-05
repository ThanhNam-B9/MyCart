import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
//
import {
  Schema,
  //  getRules,
  schema
} from 'src/utils/rules'
import Input from 'src/components/Input'
import { registerAccount } from 'src/api/auth.api'
import { omit } from 'lodash'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponseApi } from 'src/types/utils.type'
import Button from 'src/components/Button'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/appContext'
import path from 'src/constants/path'
type FormData = Schema
export default function Register() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const {
    register,
    handleSubmit,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // watch,
    setError,
    // getValues,
    formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(schema) })
  const registerAccountMutition = useMutation({
    mutationFn: (body: Omit<FormData, 'repassword'>) => registerAccount(body)
  })
  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['repassword'])
    registerAccountMutition.mutate(body, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponseApi<Omit<FormData, 'repassword'>>>(error)) {
          const formError = error.response?.data.data
          // if (formError?.email) {
          //   setError('email', {
          //     message: formError.email,
          //     type: 'Server'
          //   })
          // }
          // if (formError?.password) {
          //   setError('password', {
          //     message: formError.password,
          //     type: 'Server'
          //   })
          // }
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'repassword'>, {
                message: formError[key as keyof Omit<FormData, 'repassword'>],
                type: 'Server'
              })
            })
          }
          console.log('formError', formError)
        }
      }
    })
  })
  //debug
  // const values = watch()
  // console.log('2', values, errors)
  console.log('errors', errors)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const rules = getRules(getValues)
  // const password = watch('password') // cách nó sẽ bị render lại sẽ không tối ưu được

  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 lg:grid-cols-5 lg:py-12 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form onSubmit={onSubmit} className='p-10 rounded bg-white shadow-sm my-5' noValidate>
              {/* không muốn validate thì thay đổi type trong input hoặc thêm thuộc tính trong form "noValidate*/}
              <div className='text-2xl'>Đăng kí</div>
              <Input
                type='email'
                autoComplete='on'
                placeholder='Email'
                name='email'
                className='mt-8'
                messageError={errors.email?.message}
                register={register}
              />
              <Input
                type='password'
                autoComplete='on'
                placeholder='Mật khẩu'
                name='password'
                className='mt-2'
                messageError={errors.password?.message}
                register={register}
              />
              <Input
                type='password'
                autoComplete='on'
                placeholder='Nhập lại mật khẩu'
                name='repassword'
                className='mt-2'
                messageError={errors.repassword?.message}
                register={register}
              />
              <div className='mt-2'>
                <Button
                  type='submit'
                  className='w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600 flex items-center justify-center'
                  isLoading={registerAccountMutition.isLoading}
                  disabled={registerAccountMutition.isLoading}
                >
                  Đăng ký
                </Button>
              </div>
              <div className='mt-8'>
                <div className='flex items-center justify-center'>
                  <span className='text-slate-400 mr-1'>Bạn đã có tài khoản chưa? </span>
                  <Link className='text-red-400' to={path.login}>
                    Đăng nhập
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
