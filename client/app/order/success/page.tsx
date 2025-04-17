"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, Package, ArrowRight, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId") || "ORD123456"

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Đặt hàng thành công!</h1>
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã đặt hàng tại ShopDunk. Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Chi tiết đơn hàng</span>
            </div>
            <span className="text-sm text-gray-500">{new Date().toLocaleDateString("vi-VN")}</span>
          </div>

          <Separator className="mb-4" />

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Mã đơn hàng:</span>
              <span className="font-medium">{orderId}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Phương thức thanh toán:</span>
              <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Trạng thái:</span>
              <span className="font-medium text-yellow-600">Đang xử lý</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Phone className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800 text-left">
            Nhân viên của chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ để xác nhận đơn hàng và thông báo phí vận
            chuyển.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/" className="flex-1">
            <Button className="w-full">
              Tiếp tục mua sắm
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

