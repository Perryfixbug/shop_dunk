import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export default async function ProductCard({ product }: ProductCardProps) {

  // product.discountedPrice = product.discount > 0 ? product.price - (product.price * product.discount) / 100 : product.price

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-md">
      <div className="absolute left-0 top-0 z-10 flex flex-col gap-2 p-2">
        {product.discount > 0 && <Badge className="bg-red-600 hover:bg-red-700">Giảm {product.discount}%</Badge>}
        {product.isNew && (
          <Badge className="bg-green-600 hover:bg-green-700 flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Mới
          </Badge>
        )}
      </div>

      <div className="absolute right-0 top-0 z-10 p-2">
        {product.installment && (
          <Badge variant="outline" className="bg-white border-blue-500 text-blue-600">
            Trả góp 0%
          </Badge>
        )}
      </div>

      <Link href={`/products/${product._id}`} className="relative aspect-square w-full overflow-hidden p-4">
        <Image
          src={product.images[0] || "/placeholder.svg?height=300&width=300"}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4 pt-0">
        <Link href={`/products/${product._id}`}>
          <h3 className="text-base font-medium text-center mb-2">{product.name}</h3>
        </Link>

        <div className="mt-auto flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-blue-600">{formatCurrency(product.actualPrice)}</span>
            {product.discount > 0 && (
              <span className="text-sm text-gray-500 line-through">{formatCurrency(product.originalPrice)}</span>
            )}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link href={`/products/${product._id}`}>
            <Button variant="outline" size="sm" className="w-full">
              Chi tiết
            </Button>
          </Link>
          <Link href={`/order?productId=${product._id}&quantity=1`}>
            <Button size="sm" className="w-full">
              Đặt hàng
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

