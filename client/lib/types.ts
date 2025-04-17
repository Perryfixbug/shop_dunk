export interface Product {
  _id: string
  name: string
  originalPrice: number
  actualPrice: number
  discountedPrice?: number
  discount: number
  images: [string]
  category: string
  color: string
  isNew?: boolean
  installment?: boolean
}

