"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Copy, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { useState } from "react"

export default function BankingPage() {
  const searchParams = useSearchParams()
  const amount = searchParams.get("amount") || "0"
  const [copied, setCopied] = useState<string | null>(null)

  const bankingInfo = [
    {
      id: "account-number",
      label: "Số tài khoản",
      value: "0123456789",
      bank: "Vietcombank",
      accountName: "CONG TY TNHH SHOPDUNK",
    },
    {
      id: "amount",
      label: "Số tiền",
      value: formatCurrency(Number.parseInt(amount)),
    },
    {
      id: "content",
      label: "Nội dung chuyển khoản",
      value: `SHOPDUNK ${Math.floor(Math.random() * 1000000)}`,
    },
  ]

  const copyToClipboard = (id: string, value: string) => {
    navigator.clipboard.writeText(value)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Thanh toán chuyển khoản</h1>
          <p className="text-gray-600">Vui lòng chuyển khoản theo thông tin bên dưới để hoàn tất đơn hàng</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium">Thông tin chuyển khoản</span>
          </div>

          <Separator className="mb-4" />

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gray-600">Ngân hàng:</span>
                <span className="font-medium">Vietcombank</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gray-600">Chủ tài khoản:</span>
                <span className="font-medium">CONG TY TNHH SHOPDUNK</span>
              </div>
            </div>

            {bankingInfo.map((info) => (
              <div key={info.id} className="flex flex-col">
                <span className="text-gray-600 text-sm mb-1">{info.label}</span>
                <div className="flex items-center justify-between bg-white border border-gray-200 rounded-md p-3">
                  <span className="font-medium">{info.value}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(info.id, info.value.toString().replace(/[^\d]/g, ""))}
                    className="h-8 px-2"
                  >
                    {copied === info.id ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>Lưu ý:</strong> Vui lòng chuyển khoản đúng số tiền và nội dung để đơn hàng được xử lý nhanh chóng.
            Đơn hàng sẽ được xác nhận sau khi chúng tôi nhận được thanh toán.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/checkout/success?orderId=ORD123456" className="flex-1">
            <Button variant="outline" className="w-full">
              Tôi đã thanh toán
            </Button>
          </Link>
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

