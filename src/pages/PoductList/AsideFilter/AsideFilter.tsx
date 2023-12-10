import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'
import path from 'src/constants/path'
import { Category } from 'src/types/category.type'
import { ProductListConfig } from 'src/types/product.type'
import classNames from 'classnames'
import InputNumber from 'src/components/InputNumber'
import { useForm, Controller } from 'react-hook-form'
import { Schema, schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { NoUndefineField } from 'src/types/utils.type'
import RatingStar from '../RatingStars'
import { omit } from 'lodash'

import { ObjectSchema } from 'yup'
import { QueryConfig } from 'src/hooks/useQueryConfig'
interface Props {
  queryConfig: QueryConfig
  categories: Category[]
}
type FormData = NoUndefineField<Pick<Schema, 'price_min' | 'price_max'>>
const priceSchema = schema.pick(['price_min', 'price_max'])
export default function AsideFilter({ queryConfig, categories }: Props) {
  const {
    control,
    handleSubmit,

    trigger,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver(priceSchema as ObjectSchema<FormData>),
    shouldFocusError: false
  })
  const { category } = queryConfig
  const isActiveCategory = (categoryName: Exclude<ProductListConfig['category'], undefined>) => {
    return categoryName === category
  }

  const handleDeleteAll = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(omit(queryConfig, ['price_min', 'price_max', 'rating_filter', 'category'])).toString()
    })
  }
  const navigate = useNavigate()
  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_min: data.price_min,
        price_max: data.price_max
      }).toString()
    })
  })
  return (
    <div className='py-4'>
      <Link
        to={path.home}
        className={classNames('flex items-center font-bold', {
          'text-orange': !category
        })}
      >
        <svg viewBox='0 0 12 10' className='w-3 h-4 mr-3 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>
        Tất cả danh mục
      </Link>
      <div className='bg-gray-300 h-[1px] my-4'></div>
      <div>
        <ul>
          {categories.map((item) => {
            return (
              <li className='py-2 pl-3' key={item._id}>
                <Link
                  to={{
                    pathname: path.home,
                    search: createSearchParams({
                      ...queryConfig,
                      category: item._id
                    }).toString()
                  }}
                  className={classNames('px-2 relative font-semibold text-left text-sm', {
                    'text-orange': isActiveCategory(item._id)
                  })}
                >
                  {isActiveCategory(item._id) && (
                    <svg viewBox='0 0 4 7' className='fill-orange h-2 w-2 absolute top-1 left-[-10px] '>
                      <polygon points='4 3.5 0 0 0 7' />
                    </svg>
                  )}
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
      <Link to={path.login} className='flex items-center font-bold mt-6 uppercase'>
        <svg
          enableBackground='new 0 0 15 15'
          viewBox='0 0 15 15'
          x={0}
          y={0}
          className='w-3 h-4 mr-1 fill-current stroke-current'
        >
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeMiterlimit={10}
            />
          </g>
        </svg>
        Bộ Lọc tìm kiếm
      </Link>
      <div className='bg-gray-300 h-[1px] my-4' />
      <div className='mt-5'>
        <div>Khoản giá</div>
        <form className='mt-3' onSubmit={onSubmit}>
          <div className='flex items-center '>
            <Controller
              control={control}
              name='price_min'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    autoComplete='on'
                    placeholder='₫ TỪ'
                    classNameInput='p-1 w-full placeholder:text-sm outline-none border border-gray-500 rounded-sm focus:shadow-sm text-sm text-black/60'
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_max')
                    }}
                    value={field.value}
                    ref={field.ref}
                    classNameError='hidden'
                  />
                )
              }}
            />
            <div className='mx-2 shrink-0'>-</div>
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    autoComplete='on'
                    placeholder='₫ ĐẾN'
                    classNameInput='p-1 w-full placeholder:text-sm outline-none border border-gray-500 rounded-sm focus:shadow-sm text-sm text-black/60'
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_min')
                    }}
                    ref={field.ref}
                    classNameError=' hidden'
                  />
                )
              }}
            />
          </div>
          <span className='mt-1 text-red-600 min-h[1.25rem] text-sm'>{errors.price_min?.message}</span>
          <Button className='w-full p-2 mt-3 text-white text-sm bg-orange uppercase hover:bg-opacity-80'>
            Áp dụng
          </Button>
        </form>
      </div>
      <div className='bg-gray-300 h-[1px] my-4' />
      <div className='text-sm'>Đánh giá</div>
      <RatingStar queryConfig={queryConfig} />
      <div className='bg-gray-300 h-[1px] my-4' />
      <Button
        onClick={handleDeleteAll}
        className='w-full p-2 mt-3 text-white text-sm bg-orange uppercase hover:bg-opacity-80'
      >
        Xóa tất cả
      </Button>
    </div>
  )
}
