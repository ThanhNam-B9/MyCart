import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import omit from 'lodash/omit'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import UserApi, { BodyUpdateUser } from 'src/api/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { ErrorResponseApi } from 'src/types/utils.type'
import { SchemaUser, schemaUser } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FormData = Pick<SchemaUser, 'password' | 'new_password' | 'confirm_password'>
const changePassSchema = schemaUser.pick(['password', 'new_password', 'confirm_password'])
function ChangePassword() {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      new_password: '',
      confirm_password: ''
    },
    resolver: yupResolver(changePassSchema)
  })
  const updateProfileMutation = useMutation({
    mutationFn: UserApi.updateProfile
  })
  const onSubmit = handleSubmit(async (data) => {
    try {
      const body = omit(data, ['confirm_password'])
      const res = await updateProfileMutation.mutateAsync(body as BodyUpdateUser)
      console.log('res', res)
      toast.success(res.data.message)
      reset()
    } catch (error) {
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
        console.log('formError', formError)
      }
    }
  })
  return (
    <div className='rounded-sm bg-white px-7 shadow'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Đổi mật khẩu</h1>
        <div className='mt-1 text-sm text-gray-700'>
          Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
        </div>
      </div>
      <div className='py-6 flex flex-col-reverse md:flex-row md:items-start max-w-3xl '>
        <form className='flex-grow md:pr-12 md:mt-0' onSubmit={onSubmit}>
          <div className='sm:mt-6 sm:flex flex-wrap'>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Mật khẩu cũ</div>
            <div className='sm:w-[80%] sm:pl-5 relative'>
              <Input
                classNameInput='py-2 pl-3 pr-10 w-full outline-none border border-gray-500 rounded-sm focus:shadow-sm'
                name='password'
                type='password'
                placeholder='Mật khẩu cũ'
                messageError={errors.password?.message}
                register={register}
              />
            </div>
          </div>
          <div className='sm:mt-2 sm:flex flex-wrap'>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Mật khẩu mới </div>
            <div className='sm:w-[80%] sm:pl-5 relative'>
              <Input
                classNameInput='py-2 pl-3 pr-10 w-full outline-none border border-gray-500 rounded-sm focus:shadow-sm'
                name='new_password'
                type='password'
                placeholder='Mật khẩu mới'
                messageError={errors.new_password?.message}
                register={register}
              />
            </div>
          </div>
          <div className='sm:mt-2 sm:flex flex-wrap'>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Nhập lại mật khẩu mới </div>
            <div className='sm:w-[80%] sm:pl-5 relative'>
              <Input
                classNameInput='py-2 pl-3 pr-10 w-full outline-none border border-gray-500 rounded-sm focus:shadow-sm'
                name='confirm_password'
                type='password'
                placeholder='Nhập lại mật khẩu mới'
                messageError={errors.confirm_password?.message}
                register={register}
              />
            </div>
          </div>
          <div className='sm:mt-2 sm:flex flex-wrap'>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'></div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Button
                type='submit'
                className='h8 px-4  py-2 rounded-sm capitalize  text-sm text-center bg-orange text-white'
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangePassword
