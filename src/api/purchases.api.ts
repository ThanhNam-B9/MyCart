import { Purchases, PurchasesListStatus } from 'src/types/purchases.type'
import { SuccessResponseApi } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL = '/purchases'

const purchasesApi = {
  addToCart: (body: { product_id: string; buy_count: number }) => {
    return http.post<SuccessResponseApi<Purchases>>(`${URL}/add-to-cart`, body)
  },
  updatePurchases: (body: { product_id: string; buy_count: number }) => {
    return http.put<SuccessResponseApi<Purchases[]>>(`${URL}/update-purchase`, body)
  },
  daletePurchases: (purchasesIds: string[]) => {
    console.log('anh', purchasesIds)

    return http.delete<SuccessResponseApi<{ deleted_count: number }>>(`${URL}`, {
      data: purchasesIds
    })
  },
  getPurchases: (params: { status: PurchasesListStatus }) => {
    return http.get<SuccessResponseApi<Purchases[]>>(`${URL}`, {
      params: params
    })
  },
  buyPurchases: (body: { product_id: string; buy_count: number }[]) => {
    console.log('body', body)

    return http.post<SuccessResponseApi<Purchases[]>>(`${URL}/buy-products`, body)
  }
}

export default purchasesApi
