import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { Link, createSearchParams } from 'react-router-dom'
import purchasesApi from 'src/api/purchases.api'
import path from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchase'
import useQueryParams from 'src/hooks/useQueryParams'
import { PurchasesListStatus } from 'src/types/purchases.type'
import { formatCurrency } from 'src/utils/utils'
const purchaseTabs = [
  {
    status: purchasesStatus.all,
    name: 'Tất cả'
  },
  {
    status: purchasesStatus.waitForComfirmation,
    name: 'Chờ xác nhận'
  },
  {
    status: purchasesStatus.waitForGetting,
    name: 'Chờ lấy hàng'
  },
  {
    status: purchasesStatus.inProgress,
    name: 'Đang giao'
  },
  {
    status: purchasesStatus.delivered,
    name: 'Đã giao'
  },
  {
    status: purchasesStatus.cancelled,
    name: 'Đã hủy'
  }
]
function HistoryPurchases() {
  const queryParams: { status?: string } = useQueryParams()
  const status: number = Number(queryParams.status) || purchasesStatus.all
  const purchaseTabsLink = purchaseTabs.map((item, index) => {
    return (
      <Link
        key={index}
        to={{
          pathname: path.historyPurshases,
          search: createSearchParams({
            status: String(item.status)
          }).toString()
        }}
        className={classNames('flex flex-1 items-center justify-center border-b-2 bg-white py-3 text-center', {
          'text-orange border-b-orange': status === item.status,
          'text-gray-900 border-b-black/10': status !== item.status
        })}
      >
        {item.name}
      </Link>
    )
  })
  const { data: listCartData } = useQuery({
    queryKey: ['listCart', { status: status }],
    queryFn: () => purchasesApi.getPurchases({ status: status as PurchasesListStatus })
  })
  const purchasesList = listCartData?.data.data
  return (
    <div className=''>
      <div className='overflow-auto'>
        <div className='min-w-[700px]'>
          <div className='sticky top-0 flex rounded-sm shadow-sm'>{purchaseTabsLink}</div>
          <div className=''>
            {purchasesList &&
              purchasesList.map((item) => {
                return (
                  <div key={item._id} className='mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm '>
                    <Link to={'#'} className='flex'>
                      <div className='flex-shrink-0 '>
                        <img src={item.product.image} alt='hình ảnh sản phẩm' className='h-20 w-20 object-cover' />
                      </div>
                      <div className='ml-3 flex-grow overflow-hidden'>
                        <div className='truncate'>{item.product.name}</div>
                        <div className='mt-3'>x {item.buy_count}</div>
                      </div>
                      <div className='flex-shrink-0 ml-3'>
                        <span className='truncate text-gray-500 line-through'>
                          ₫{formatCurrency(item.product.price_before_discount)}
                        </span>
                        <span className='truncate text-orange ml-2'>₫{formatCurrency(item.product.price)}</span>
                      </div>
                    </Link>
                    <div className='flex justify-end items-center gap-2'>
                      <span>Tổng tiền: </span>
                      <span className='text-orange text-lg '>
                        ₫{formatCurrency(item.product.price_before_discount * item.buy_count)}
                      </span>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HistoryPurchases
