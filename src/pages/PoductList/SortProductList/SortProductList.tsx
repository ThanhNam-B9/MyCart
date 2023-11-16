import { sortBy, orderBy } from 'src/constants/product'
import classNames from 'classnames'
import { ProductListConfig } from 'src/types/product.type'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import { omit } from 'lodash'
import { QueryConfig } from 'src/hooks/useQueryConfig'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}
export default function SortProductList({ queryConfig, pageSize }: Props) {
  const navigate = useNavigate()
  const page = Number(queryConfig.page)

  const { sort_by = sortBy.createdAt, order } = queryConfig

  const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }
  const handleSort = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortByValue,
            page: '1'
          },
          ['order']
        )
      ).toString()
    })
  }
  const handlePriceOrder = (orderByValue: Exclude<ProductListConfig['order'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price,
        order: orderByValue
      }).toString()
    })
  }
  return (
    <div className='bg-gra-300/40 py-4 px-3 '>
      <div className='flex items-center justify-between flex-wrap gap-2'>
        <div className='flex items-center flex-wrap gap-2'>
          <div>Sắp xếp theo</div>
          <button
            onClick={() => handleSort(sortBy.view)}
            className={classNames('h8 px-4  py-2 rounded-sm capitalize  text-sm text-center', {
              'bg-orange text-white': isActiveSortBy(sortBy.view),
              'bg-white text-black': !isActiveSortBy(sortBy.view)
            })}
          >
            Phổ biến
          </button>
          <button
            onClick={() => handleSort(sortBy.createdAt)}
            className={classNames('h8 px-4  py-2 rounded-sm capitalize  text-sm text-center', {
              'bg-orange text-white': isActiveSortBy(sortBy.createdAt),
              'bg-white text-black': !isActiveSortBy(sortBy.createdAt)
            })}
          >
            Mới nhất
          </button>
          <button
            onClick={() => handleSort(sortBy.sold)}
            className={classNames('h8 px-4  py-2 rounded-sm capitalize  text-sm text-center', {
              'bg-orange text-white': isActiveSortBy(sortBy.sold),
              'bg-white text-black': !isActiveSortBy(sortBy.sold)
            })}
          >
            Bán chạy
          </button>
          <select
            className={classNames(
              'px-2 py-2 capitalize bg-white rounded-sm text-black text-sm hover:bg-white/80 text-left outline-none',
              {
                'text-orange': isActiveSortBy(sortBy.price)
              }
            )}
            value={order || ''}
            onChange={(e) => handlePriceOrder(e.target.value as Exclude<ProductListConfig['order'], undefined>)}
          >
            <option value=''>Giá</option>

            <option value={orderBy.asc}>Từ thấp đến cao</option>
            <option value={orderBy.desc}>Từ cao đến thấp</option>
          </select>
        </div>
        <div className='flex items-center gap-3'>
          <div>
            <span className='text-orange'>{page}</span>
            <span>/{pageSize}</span>
          </div>
          <div className='flex items-center'>
            {page === 1 ? (
              <span className='h-8 px-3 rounded-tl-sm  bg-white/50 cursor-not-allowed  flex items-center justify-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-4 h-4'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page - 1).toString()
                  }).toString()
                }}
                className='h-8 px-3 rounded-tl-sm  bg-white hover:bg-slate-100 shadow flex items-center justify-center'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-4 h-4'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </Link>
            )}
            {page === pageSize ? (
              <span className='h-8 px-3 rounded-br-sm bg-white/50  cursor-not-allowed flex items-center justify-center '>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-4 h-4'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page + 1).toString()
                  }).toString()
                }}
                className='h-8 px-3 rounded-br-sm bg-white hover:bg-slate-100 shadow flex items-center justify-center'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-4 h-4'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
