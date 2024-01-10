import { useMutation, useQuery } from '@tanstack/react-query'
import { produce } from 'immer'
import { keyBy } from 'lodash'
import { useEffect, useContext, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import purchasesApi from 'src/api/purchases.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchase'
import { AppContext } from 'src/contexts/appContext'
import { Purchases } from 'src/types/purchases.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import noProductInCart from 'src/assets/images/no_cart.png'

export interface ExtentPurshases extends Purchases {
  disable: boolean
  checked: boolean
}

function Cart() {
  const { purchasesListOpt, setPurchasesListOpt } = useContext(AppContext)
  // const [purchasesListOpt, setPurchasesListOpt] = useState<ExtentPurshases[]>([])

  const location = useLocation()
  const purchaseIdNow = (location.state as { purchaseId: string | null })?.purchaseId

  const { data: listCartData, refetch } = useQuery({
    queryKey: ['listCart', { status: purchasesStatus.inCart }],
    queryFn: () => purchasesApi.getPurchases({ status: purchasesStatus.inCart })
  })
  const updatePurhaseMutation = useMutation({
    mutationFn: purchasesApi.updatePurchases
  })
  const deletePurhaseMutation = useMutation({
    mutationFn: purchasesApi.daletePurchases
  })
  const buyPurhaseMutation = useMutation({
    mutationFn: purchasesApi.buyPurchases
  })
  const handleUpdateChase = (value: number, purshaseIndex: number, enable: boolean) => {
    const product_id = purchasesListOpt[purshaseIndex].product._id
    const body = { product_id, buy_count: value }
    if (enable) {
      setPurchasesListOpt(
        produce((draft) => {
          draft[purshaseIndex].disable = true
        })
      )
      console.log(body)
      updatePurhaseMutation.mutate(body, {
        onSuccess: () => {
          refetch()
        }
      })
    }
  }
  const handleUpdateChaseType = (purshaseIndex: number) => (value: number) => {
    setPurchasesListOpt(
      produce((draft) => {
        draft[purshaseIndex].buy_count = value
      })
    )
  }
  const purchasesList = listCartData?.data.data
  const isAllCheck = useMemo(() => purchasesListOpt.every((item) => item.checked), [purchasesListOpt])
  const checkPurchase = useMemo(() => purchasesListOpt.filter((item) => item.checked === true), [purchasesListOpt])
  const totalCheckPurchase = checkPurchase.length
  const totalPrice = useMemo(
    () =>
      checkPurchase.reduce((accumulator, currentValue) => {
        const count = currentValue.buy_count || 1
        return accumulator + currentValue.price * count
      }, 0),
    [checkPurchase]
  )
  const totalDicount = checkPurchase.reduce((accumulator, currentValue) => {
    const count = currentValue.buy_count || 1
    return accumulator + (currentValue.price_before_discount - currentValue.price) * count
  }, 0)

  useEffect(() => {
    setPurchasesListOpt((prev) => {
      const purchasesListOptNew = keyBy(prev, '_id')
      return (
        purchasesList?.map((item) => {
          const isCheckPurchaseNow = purchaseIdNow === item._id
          return {
            ...item,
            disable: false,
            checked: isCheckPurchaseNow || Boolean(purchasesListOptNew[item._id]?.checked)
          }
        }) || []
      )
    })
    console.log('sdahsksssssdhasj', purchasesList)
  }, [purchasesList, purchaseIdNow])
  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  }, [])
  const handleCheckPurshase = (purshaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    // cách 1 chạy map
    // setPurchasesListOpt(
    //   purchasesListOpt?.map((item, index) => {
    //     if (index === purshaseIndex) {
    //       item.checked = event.target.checked
    //     }
    //     return item
    //   })
    // )
    //cách 2 dung inmerjs
    setPurchasesListOpt(
      produce((draft) => {
        draft[purshaseIndex].checked = event.target.checked
      })
    )
  }
  const handleALLCheckPurshase = () => {
    // cách 1 chạy map

    setPurchasesListOpt(
      purchasesListOpt?.map((item) => ({
        ...item,
        checked: !isAllCheck
      }))
    )
  }
  const handleDeletePurchase = (purshaseId: string) => {
    deletePurhaseMutation.mutate([purshaseId], {
      onSuccess: () => {
        refetch()
      }
    })
  }
  const handleDeletePurchases = () => {
    if (checkPurchase.length > 0) {
      const purshaseIds = checkPurchase.map((item) => item._id)
      deletePurhaseMutation.mutate(purshaseIds, {
        onSuccess: () => {
          refetch()
        }
      })
    }
  }
  const handleBuyPurchases = () => {
    const body = checkPurchase.map((item) => {
      return {
        product_id: item.product._id,
        buy_count: item.buy_count
      }
    })

    buyPurhaseMutation.mutate(body, {
      onSuccess: (data) => {
        toast.success(data.data.message)
        refetch()
      }
    })
  }
  // console.log('llk', purchasesListOpt)

  return (
    <div className='bg-neutral-100 py-16'>
      <div className='container'>
        {purchasesList && purchasesList?.length > 0 ? (
          <>
            <div className='overflow-auto'>
              <div className='min-w-[1000px]'>
                <div className=' grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow'>
                  <div className='col-span-5'>
                    <div className='flex items-center'>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input
                          type='checkbox'
                          className='h-5 w-5 accent-orange'
                          checked={isAllCheck}
                          onChange={handleALLCheckPurshase}
                        />
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
                  {purchasesListOpt?.map((purchase, index) => {
                    return (
                      <div
                        className='first:mt-0  mt-4 grid grid-cols-12 rounded-sm border border-gray-200 bg-white py-5 px-4 text-center text-sm text-gray-500 items-center'
                        key={purchase._id}
                      >
                        <div className='col-span-5'>
                          <div className='flex'>
                            <div className='flex flex-shrink-0 items-center justify-center pr-3 '>
                              <input
                                type='checkbox'
                                className='accent-orange h-5 w-5'
                                checked={purchase.checked}
                                onChange={handleCheckPurshase(index)}
                              />
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
                                    className='line-clamp-2 text-start'
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
                                onDecrease={(value) => handleUpdateChase(value, index, purchase.buy_count > 1)}
                                onIncrease={(value) =>
                                  handleUpdateChase(value, index, purchase.buy_count <= purchase.product.quantity)
                                }
                                // onType={(value) => handleUpdateChase(value, purchase.product._id)}
                                disabled={purchase.disable}
                                onType={handleUpdateChaseType(index)}
                                classNameWrapper='flex items-center'
                                onHandleBlur={(value) =>
                                  handleUpdateChase(
                                    value,
                                    index,
                                    purchase.buy_count !== (purchasesList as Purchases[])[index].buy_count
                                  )
                                }
                              />
                            </div>
                            <div className='col-span-1 '>
                              <span className='text-orange'>
                                ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                              </span>
                            </div>
                            <div className='col-span-1 '>
                              <button
                                className='bg-none text-black hover:text-orange'
                                onClick={() => handleDeletePurchase(purchase._id)}
                                disabled={deletePurhaseMutation.isLoading}
                              >
                                Xóa
                              </button>
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
                  <input
                    type='checkbox'
                    className='w-5 h-5 accent-orange'
                    checked={isAllCheck}
                    onChange={handleALLCheckPurshase}
                  />
                  <button className='mx-3 border-none bg-none text-sm' onClick={handleALLCheckPurshase}>
                    Chọn Tất Cả ({purchasesListOpt?.length}){' '}
                  </button>
                  <button
                    className=' mx-3 border-none bg-none text-sm'
                    onClick={handleDeletePurchases}
                    disabled={buyPurhaseMutation.isLoading}
                  >
                    Xóa
                  </button>
                </div>
                <div className=' flex items-start md:items-center md:justify-end flex-col w-full gap-3 md:flex-row'>
                  <div className='flex items-start flex-col w-full md:w-auto'>
                    <div className='flex items-center justify-between w-full gap-2 '>
                      <div className=''>Tổng thanh toán ( {totalCheckPurchase || '0'} sản phẩm):</div>
                      <div className='text-2xl text-orange'>₫{formatCurrency(totalPrice)}</div>
                    </div>
                    <div className='flex items-center justify-end text-sm w-full  gap-2'>
                      <div className='text-gray-500 text-sm'>Tiết kiệm</div>
                      <div className=' text-orange tex-sm'>₫{formatCurrency(totalDicount)}</div>
                    </div>
                  </div>
                  <div className='flex items-center justify-end w-full md:w-auto'>
                    <Button
                      className=' w-52 h-10 rounded-sm text-center  uppercase bg-red-500 text-white text-sm hover:bg-red-600 flex items-center justify-center'
                      onClick={handleBuyPurchases}
                      disabled={checkPurchase.length === 0}
                      isLoading={buyPurhaseMutation.isLoading}
                    >
                      Mua hàng
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className='flex flex-col justify-center items-center gap-5 h-72'>
            <img src={noProductInCart} alt='no product in cart' className='w-24 h-24' />

            <h3>Không có sản phẩm trong giỏ hàng !</h3>

            <Link
              to={path.home}
              className=' w-52 h-10 rounded-sm text-center  uppercase bg-red-500 text-white text-sm hover:bg-red-600 flex items-center justify-center'
            >
              Tiếp tục mua sản phẩm
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
