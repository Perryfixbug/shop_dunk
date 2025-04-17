import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { getCookie } from "@/lib/cookie"
import { postAPI } from "@/lib/api"

interface CheckoutSummaryProps {
  cartItems: Array<{
    productId: any
    quantity: number
  }>
  subtotal: number,
  shippingAddress: String,
  shippingCost: number
  total: number
  isProcessing: boolean
}

export default function CheckoutSummary({
  cartItems,
  subtotal,
  shippingCost,
  shippingAddress,
  total,
  isProcessing,
}: CheckoutSummaryProps) {

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden sticky top-4">
      <div className="bg-gray-50 px-6 py-4">
        <h2 className="font-medium">Tóm tắt đơn hàng</h2>
      </div>

      <div className="p-6">
        <div className="space-y-4 mb-6">
          {cartItems.map((item, index) => (
            <div key={index} className="flex gap-4">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <Image
                  src={item.productId?.images[0] || "/placeholder.svg?height=64&width=64"}
                  alt={item.productId.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">{item.productId.name}</h4>
                <p className="mt-1 text-xs text-gray-500">SL: {item.quantity}</p>
              </div>
              <div className="text-sm font-medium">{formatCurrency(item.productId.actualPrice * item.quantity)}</div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tạm tính</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Phí vận chuyển</span>
            <span>{formatCurrency(shippingCost)}</span>
          </div>

          <Separator />

          <div className="flex justify-between text-base font-medium">
            <span>Tổng cộng</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <Button type="submit" 
          className="w-full mt-6" 
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            "Hoàn tất đơn hàng"
          )}
        </Button>

        <p className="mt-4 text-xs text-gray-500">
          Bằng cách nhấn "Hoàn tất đơn hàng", bạn đồng ý với các điều khoản và điều kiện của chúng tôi.
        </p>
      </div>
    </div>
  )
}

