import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Fragment, useContext, useEffect, useMemo, useState } from 'react'
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form'
import UserApi, { BodyUpdateUser } from 'src/api/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputNumber from 'src/components/InputNumber'
import { SchemaUser, schemaUser } from 'src/utils/rules'
import DateSelect from '../../components/DateSelect'
import { toast } from 'react-toastify'
import { AppContext } from 'src/contexts/appContext'
import { saveProfileToLS } from 'src/utils/auth'
import { getAvtatar, isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponseApi } from 'src/types/utils.type'
import InputFile from 'src/components/InputFile'

function Info() {
  const {
    register,
    control,
    formState: { errors }
  } = useFormContext<FormData>()
  return (
    <Fragment>
      <div className='sm:mt-6 sm:flex flex-wrap'>
        <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Tên</div>
        <div className='sm:w-[80%] sm:pl-5'>
          <Input
            classNameInput='py-2 px-3 w-full outline-none border border-gray-500 rounded-sm focus:shadow-sm'
            messageError={errors.name?.message}
            register={register}
            placeholder='Tên'
            name='name'
          />
        </div>
      </div>
      <div className='sm:mt-2 sm:flex flex-wrap'>
        <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Số điện thoại</div>
        <div className='sm:w-[80%] sm:pl-5'>
          <Controller
            control={control}
            name='phone'
            render={({ field }) => {
              return (
                <InputNumber
                  classNameInput='py-2 px-3 w-full outline-none border border-gray-500 rounded-sm focus:shadow-sm'
                  messageError={errors.phone?.message}
                  placeholder='Số điện thoại'
                  {...field}
                  onChange={field.onChange}
                />
              )
            }}
          />
        </div>
      </div>
    </Fragment>
  )
}

type FormData = Pick<SchemaUser, 'name' | 'phone' | 'avatar' | 'date_of_birth' | 'address'>
type FormDataError = Omit<FormData, 'date_of_birth'> & {
  date_of_birth: string
}
const profileSchema = schemaUser.pick(['name', 'phone', 'avatar', 'date_of_birth', 'address'])
function Profile() {
  const [file, setFile] = useState<File>()
  const previewImgage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])
  const { setProfile } = useContext(AppContext)
  const methods = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver<FormData>(profileSchema)
  })
  const {
    register,
    setValue,
    watch,
    control,
    handleSubmit,
    setError,
    formState: { errors }
  } = methods

  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: UserApi.getProfile
  })
  const updateProfileMutation = useMutation({
    mutationFn: UserApi.updateProfile
  })
  const saveImgToSeverMutation = useMutation(UserApi.updateUploadAvatar)
  const profile = profileData?.data.data
  const avatar = watch('avatar')
  const onSubmit = handleSubmit(async (data) => {
    try {
      let avatarURL = avatar
      if (file) {
        const form = new FormData()
        form.append('image', file)
        const res = await saveImgToSeverMutation.mutateAsync(form)
        console.log(res.data.data)
        avatarURL = res.data.data
        setValue('avatar', avatarURL)
      }
      const body = { ...data, date_of_birth: data.date_of_birth?.toISOString(), avatar: avatarURL }

      const res = await updateProfileMutation.mutateAsync(body as BodyUpdateUser)
      console.log('res', res)

      setProfile(res.data.data)
      saveProfileToLS(res.data.data)
      toast.success(res.data.message)
      refetch()
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponseApi<FormDataError>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormDataError, {
              message: formError[key as keyof FormDataError],
              type: 'Server'
            })
          })
        }
        console.log('formError', formError)
      }
    }
  })
  const handleOnChangeFile = (file?: File) => {
    setFile(file)
  }
  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('phone', profile.phone)
      setValue('address', profile.address)
      setValue('avatar', profile.avatar)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
    }
  }, [profile, setValue])
  return (
    <div className='rounded-sm bg-white px-7 shadow'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ sơ của tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <FormProvider {...methods}>
        <form className='py-6 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
          <div className=' flex-grow md:pr-12 md:mt-0'>
            <div className='sm:flex flex-wrap'>
              <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Email</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <div className='pt-3 text-gray-700'>{profile?.email}</div>
              </div>
            </div>
            <Info />
            <div className='sm:mt-2 sm:flex flex-wrap'>
              <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Địa chỉ</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Input
                  classNameInput='py-2 px-3 w-full outline-none border border-gray-500 rounded-sm focus:shadow-sm'
                  messageError={errors.address?.message}
                  register={register}
                  placeholder='Địa chỉ'
                  name='address'
                />
              </div>
            </div>
            <Controller
              control={control}
              name='date_of_birth'
              render={({ field }) => {
                return (
                  <DateSelect
                    onChange={(value) => field.onChange(value)}
                    value={field.value}
                    errorMessage={errors.date_of_birth?.message}
                  />
                )
              }}
            />
            <div className='sm:mt-2 sm:flex flex-wrap'>
              <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'></div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Button
                  type='submit'
                  className='h8 px-4  py-2 rounded-sm capitalize  text-sm text-center bg-orange text-white'
                >
                  Lưu
                </Button>
              </div>
            </div>
          </div>
          <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
            <div className='flex flex-col items-center'>
              <div className='my-5 h-24 w-24 bg-gray-200 rounded-full flex justify-center items-center'>
                <img
                  src={previewImgage || getAvtatar(avatar)}
                  alt=''
                  className='h-full w-full rounded-full object-cover '
                />
                {/* <svg
                enableBackground='new 0 0 15 15'
                viewBox='0 0 15 15'
                x='0'
                y='0'
                className='w-12 h-12 stroke-slate-400'
              >
                <g>
                  <circle cx='7.5' cy='4.5' fill='none' r='3.8' strokeMiterlimit='10'></circle>
                  <path
                    d='m1.5 14.2c0-3.3 2.7-6 6-6s6 2.7 6 6'
                    fill='none'
                    strokeLinecap='round'
                    strokeMiterlimit='10'
                  ></path>
                </g>
              </svg> */}
              </div>

              <InputFile onChange={handleOnChangeFile} />
              <div className='mt-3 text-gray-400'>
                <div className=''>Dụng lượng file tối đa 1 MB</div>
                <div className=''>Định dạng: .JPEG, .PNG</div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default Profile
