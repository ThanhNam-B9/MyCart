import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import purchasesApi from 'src/api/purchases.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchase'
import { formatCurrency, generateNameId } from 'src/utils/utils'

function Cart() {
  const { data: listCartData } = useQuery({
    queryKey: ['listCart', { status: purchasesStatus.inCart }],
    queryFn: () => purchasesApi.getPurchases({ status: purchasesStatus.inCart })
  })
  const purchasesList = listCartData?.data.data
  return (
    <div className='bg-neutral-100 py-16'>
      <div className='container'>
        <div className='overflow-auto'>
          <div className='min-w-[1000px]'>
            <div className=' grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow'>
              <div className='col-span-5'>
                <div className='flex items-center'>
                  <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                    <input type='checkbox' className='h-5 w-5 accent-orange' />
                  </div>
                  <div className='flex-grow text-black'>Sản phẩm</div>
                </div>
              </div>
              <div className='col-span-7'>
                <div className='grid text-center grid-cols-5'>
                  <div className='col-span-2'>Đơn giá</div>
                  <div className='col-span-1'>Số lượng</div>
                  <div className='col-span-1'>Số tiền</div>
                  <div className='col-span-1'>Thao tác</div>
                </div>
              </div>
            </div>
            <div className='my-3 rouned-sm bg-white p-5 shadow'>
              {purchasesList?.map((purchase) => {
                return (
                  <div
                    className='first:mt-0  mt-4 grid grid-cols-12 rounded-sm border border-gray-200 bg-white py-5 px-4 text-center text-sm text-gray-500'
                    key={purchase._id}
                  >
                    <div className='col-span-5'>
                      <div className='flex'>
                        <div className='flex flex-shrink-0 items-center justify-center pr-3 '>
                          <input type='checkbox' className='accent-orange h-5 w-5' />
                        </div>
                        <div className='flex-grow'>
                          <div className='flex'>
                            <Link
                              to={`${path.home}${generateNameId({
                                name: purchase.product.name,
                                id: purchase.product._id
                              })}`}
                              className='w-20 h-20 flex-shrink-0'
                            >
                              <img src={purchase.product.image} alt={purchase.product.name} />
                            </Link>
                            <div className='flex-grow px-2 pt-1 pb-2'>
                              <Link
                                to={`${path.home}${generateNameId({
                                  name: purchase.product.name,
                                  id: purchase.product._id
                                })}`}
                                className='line-clamp-2'
                              >
                                {purchase.product.name}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-span-7'>
                      <div className='grid grid-cols-5 items-center'>
                        <div className='col-span-2'>
                          <div className='flex items-center justify-center'>
                            <span className='text-gray-300 line-through'>
                              ₫{formatCurrency(purchase.product.price_before_discount)}
                            </span>
                            <span className='ml-3'>{formatCurrency(purchase.product.price)}</span>
                          </div>
                        </div>
                        <div className='col-span-1 '>
                          <QuantityController
                            max={purchase.product.quantity}
                            value={purchase.buy_count}
                            classNameWrapper='flex items-center'
                          />
                        </div>
                        <div className='col-span-1 '>
                          <span className='text-orange'>
                            ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                          </span>
                        </div>
                        <div className='col-span-1 '>
                          <button className='bg-none text-black hover:text-orange'>Xóa</button>
                          <button className='bg-none text-orange mt-1 text-xs'>Tìm sản phẩm tương tự</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className='sticky bottom-0 z-10  rounded-sm bg-white p-5 shadow border-gray-100 '>
          <div className='flex flex-col md:flex-row md:justify-between items-start gap-3 justify-center '>
            <div className='flex flex-shrink-0 items-center justify-start pr-3 '>
              <input type='checkbox' className='w-5 h-5 accent-orange' />
              <button className='mx-3 border-none bg-none text-sm'>Chọn Tất Cả ({purchasesList?.length}) </button>
              <button className=' mx-3 border-none bg-none text-sm'>Xóa</button>
            </div>
            <div className=' flex items-start md:items-center md:justify-end flex-col w-full gap-3 md:flex-row'>
              <div className='flex items-start flex-col w-full md:w-auto'>
                <div className='flex items-center justify-between w-full gap-2 '>
                  <div className=''>Tổng thanh toán (3 sản phẩm):</div>
                  <div className='text-2xl text-orange'>100000</div>
                </div>
                <div className='flex items-center justify-end text-sm w-full  gap-2'>
                  <div className='text-gray-500 text-sm'>Tiết kiệm</div>
                  <div className=' text-orange tex-sm'>3000</div>
                </div>
              </div>
              <div className='flex items-center justify-end w-full md:w-auto'>
                <Button className=' w-52 h-10 rounded-sm text-center  uppercase bg-red-500 text-white text-sm hover:bg-red-600 flex items-center justify-center'>
                  Mua hàng
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
