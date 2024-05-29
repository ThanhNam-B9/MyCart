import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import productApi from 'src/api/product.api'
import ProductRating from 'src/components/ProductRating'
import { Product as ProductType, ProductListConfig } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle, getIdFormNameId, rateSale } from 'src/utils/utils'
import Product from '../PoductList/Product'
import QuantityController from 'src/components/QuantityController'
import purchasesApi from 'src/api/purchases.api'
import { purchasesStatus } from 'src/constants/purchase'
import { toast } from 'react-toastify'
import path from 'src/constants/path'
import { useTranslation } from 'react-i18next'
import { AppContext } from 'src/contexts/appContext'

export default function ProductDetail() {
  const [currentIndexImg, setCurrentIndexImg] = useState([0, 5])
  const [activeImg, setActiveImg] = useState('')
  const [buyCount, setBuyCount] = useState<number>(1)
  const { nameId } = useParams()
  const { t } = useTranslation('product')
  const id = getIdFormNameId(nameId as string)
  const { isAuthenticated } = useContext(AppContext)

  const imgRef = useRef<HTMLImageElement>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: productData } = useQuery({
    queryKey: ['product', nameId],
    queryFn: () => productApi.getDetailProduct(id)
  })
  const product = productData?.data?.data
  const currentImages = useMemo(
    () => (product ? product?.images.slice(...currentIndexImg) : []),
    [product, currentIndexImg]
  )
  const queryConfig: ProductListConfig = { limit: '20', page: '1', category: product?.category._id }
  const { data: productsData } = useQuery({
    queryKey: ['product', queryConfig],
    queryFn: () => productApi.getAllProduct(queryConfig),
    staleTime: 3 * 60 * 1000,
    enabled: Boolean(product)
  })
  const addToCartMutation = useMutation({
    mutationFn: (body: { product_id: string; buy_count: number }) => purchasesApi.addToCart(body)
  })
  const isCheckLogin = () => {
    if (!isAuthenticated) {
      navigate(path.login)
      return false
    }
    return true
  }

  const handleAddToCart = () => {
    const isCheck = isCheckLogin()
    if (isCheck) {
      const body = { product_id: product?._id as string, buy_count: buyCount }
      addToCartMutation.mutate(body, {
        onSuccess: (data) => {
          toast.success(data.data.message, { autoClose: 1500 })
          queryClient.invalidateQueries({ queryKey: ['listCart', { status: purchasesStatus.inCart }] })
        }
      })
    }
  }
  const handleBuyNow = async () => {
    const isCheck = isCheckLogin()
    if (isCheck) {
      const body = { product_id: product?._id as string, buy_count: buyCount }

      const res = await addToCartMutation.mutateAsync(body)
      console.log('res', res)
      navigate(path.cart, {
        state: {
          purchaseId: res.data.data._id
        }
      })
    }
  }
  const handleZome = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    // console.log(rect)
    const images = imgRef?.current as HTMLImageElement
    const { naturalHeight, naturalWidth } = images
    // Cách 1 : xử lý event bubble
    // const { offsetX, offsetY } = e.nativeEvent
    // Cách 2 : không cần xử lý event bubble
    const offsetX = e.pageX - (rect.x + window.scrollX)
    const offsetY = e.pageY - (rect.y + window.scrollY)
    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    images.style.width = naturalWidth + 'px'
    images.style.height = naturalHeight + 'px'
    images.style.maxWidth = 'unset'
    images.style.top = top + 'px'
    images.style.left = left + 'px'
  }
  const handleRestZoom = () => {
    imgRef?.current?.removeAttribute('style')
  }

  useEffect(() => {
    if (product && product?.images.length > 0) {
      setActiveImg(product?.images[0])
    }
  }, [product])
  const chooseActiveImg = (img: string) => {
    setActiveImg(img)
  }
  const nextIndex = () => {
    if (currentIndexImg[1] < (product as ProductType)?.images.length) {
      setCurrentIndexImg((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }
  const prevIndex = () => {
    if (currentIndexImg[0] > 0) {
      setCurrentIndexImg((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }
  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }
  if (!product)
    return (
      <div className='flex items-center justify-center w-screen bg-white '>
        <div className='px-40 my-20 py-20 bg-orange rounded-md shadow-xl'>
          <div className='flex flex-col items-center'>
            <p className='mb-8 text-center text-white md:text-lg'>Không thể tải Shop này. Vui lòng chạm và thử lại.</p>

            <Link
              to={path.home}
              className=' w-52 h-10 rounded-sm text-center   uppercase bg-white text-orange text-sm hover:shadow-sm flex items-center justify-center'
            >
              Trang chủ
            </Link>
          </div>
        </div>
      </div>
    )
  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        <div className='bg-white p-4 shadow '>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              <div
                className='relative w-full pt-[100%] shadow rounded-sm overflow-hidden cursor-zoom-in'
                onMouseMove={handleZome}
                onMouseLeave={handleRestZoom}
              >
                <img
                  src={activeImg}
                  alt={product.name}
                  className='absolute top-0 left-0  h-full w-full bg-white object-cover pointer-events-none'
                  ref={imgRef}
                />
              </div>
              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button
                  className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={prevIndex}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                  </svg>
                </button>
                {currentImages.map((img) => {
                  const isActive = activeImg === img
                  return (
                    <div
                      className='relative w-full pt-[100%] cursor-pointer'
                      key={img}
                      onMouseEnter={() => chooseActiveImg(img)}
                    >
                      <img
                        src={img}
                        alt={product.name}
                        className='absolute top-0 h-full w-full bg-white object-cover'
                      />
                      {isActive && <div className='absolute inset-0 border-2 border-orange'> </div>}
                    </div>
                  )
                })}
                <button
                  className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={nextIndex}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
              </div>
            </div>
            <div className='col-span-7'>
              <h1 className='text-xl font-medium uppercase'>{product.name}</h1>
              <div className='mt-8 flex items-center'>
                <div className='flex items-center'>
                  <span className='mr-1 border-b border-b-orange text-orange'>{product.rating}</span>
                  <ProductRating
                    rating={product.rating}
                    activeClassname='fill-orange text-orange h-4 w-4'
                    nonActiveClasname='fill-gray-300 text-gray-300 h-4 w-4'
                  />
                </div>
                <div className='mx-4 h-4 w-[1px] bg-gray-300 '></div>
                <div>
                  <span>{formatNumberToSocialStyle(product.sold)}</span>
                  <span className='ml-1 text-gray-500'>Đã bán</span>
                </div>
              </div>
              <div className='mt-8 flex items-center bg-gray-50 py-4'>
                <div className='text-gray-500 line-through'>₫{formatCurrency(product.price_before_discount)}</div>
                <div className='ml-3 text-3x font-medium text-orange'>₫{formatCurrency(product.price)}</div>
                <div className='ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white'>
                  {rateSale(product.price_before_discount, product.price)} giảm
                </div>
              </div>
              <div className='mt-8 flex items-center'>
                <div className='capitalize text-gray-500'>Số lượng</div>
                <QuantityController
                  max={product.quantity}
                  onIncrease={handleBuyCount}
                  onDecrease={handleBuyCount}
                  onType={handleBuyCount}
                  value={buyCount}
                />
                <div className='ml-6 etxt-sm text-gray-500'>{product.quantity} sản phẩm có sẵn</div>
              </div>
              <div className='mt-8 flex items-center'>
                <button
                  className='flex h-12 items-center justify-center px-4 rounded-sm border border-orange bg-orange/10 capitalize text-orange shadow-sm hover:bg-orange/5'
                  onClick={handleAddToCart}
                >
                  <svg
                    enableBackground='new 0 0 15 15'
                    viewBox='0 0 15 15'
                    x={0}
                    y={0}
                    className='mr-[10px] h5 w-5 fill-current stroke-orange text-orange'
                  >
                    <g>
                      <g>
                        <polyline
                          fill='none'
                          points='.5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeMiterlimit={10}
                        />
                        <circle cx={6} cy='13.5' r={1} stroke='none' />
                        <circle cx='11.5' cy='13.5' r={1} stroke='none' />
                      </g>
                      <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1='7.5' x2='10.5' y1={7} y2={7} />
                      <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1={9} x2={9} y1='8.5' y2='5.5' />
                    </g>
                  </svg>
                  Thêm vào giỏ hàng
                </button>
                <button
                  className='ml-4 flex h-12 items-center justify-center px-6 rounded-sm  min-w-[5rem] bg-orange capitalize text-white shadow-sm hover:bg-orange/80'
                  onClick={handleBuyNow}
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='container'>
        <div className='mt-8 bg-white p-4 shadow '>
          <div className='rounded bg-gray-50 p-4 text-lg capitalize text-slate-700'>{t('product.desription')}</div>
          <div
            className='mx-4 mt-12 text-sm leading-loose'
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }}
          />
        </div>
      </div>
      <div className='mt-8'>
        <div className='container'>
          <div className='uppercase text-gray-400'>Bạn có thể thích</div>
          {productsData && (
            <div className='mt-6 grid grid-cols-2 md:grid-cols-3 ld:grid-cols-4 xl:grid-cols-5 gap-3'>
              {productsData?.data?.data?.products.map((product) => {
                return (
                  <div className='col-span-1' key={product._id}>
                    <Product product={product} />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
