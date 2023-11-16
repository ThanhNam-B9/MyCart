import { Product, ProductList, ProductListConfig } from 'src/types/product.type'
import { SuccessResponseApi } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL = '/products'
const productApi = {
  getAllProduct: (params: ProductListConfig) => {
    return http.get<SuccessResponseApi<ProductList>>(URL, {
      params
    })
  },
  getDetailProduct: (id: string) => {
    return http.get<SuccessResponseApi<Product>>(`${URL}/${id}`)
  }
}

export default productApi
