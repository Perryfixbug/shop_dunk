"use client"

import { CreditCard } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface PaymentMethodSelectorProps {
  selectedMethod: string
  onSelectMethod: (method: string) => void
}

export default function PaymentMethodSelector({ selectedMethod, onSelectMethod }: PaymentMethodSelectorProps) {
  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 flex items-center">
        <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
        <h2 className="font-medium">Phương thức thanh toán</h2>
      </div>

      <div className="p-6">
        <RadioGroup value={selectedMethod} onValueChange={onSelectMethod} className="space-y-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cod" id="cod" />
            <Label htmlFor="cod" className="flex flex-1 items-center cursor-pointer">
              <div className="mr-4 h-10 w-10 flex items-center justify-center rounded-md bg-gray-100">
                <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
                <p className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</p>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="banking" id="banking" />
            <Label htmlFor="banking" className="flex flex-1 items-center cursor-pointer">
              <div className="mr-4 h-10 w-10 flex items-center justify-center rounded-md bg-gray-100">
                <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <div>
                <span className="font-medium">Chuyển khoản ngân hàng</span>
                <p className="text-sm text-gray-500">Thanh toán qua chuyển khoản ngân hàng</p>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card" className="flex flex-1 items-center cursor-pointer">
              <div className="mr-4 h-10 w-10 flex items-center justify-center rounded-md bg-gray-100">
                <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <div>
                <span className="font-medium">Thẻ tín dụng/ghi nợ</span>
                <p className="text-sm text-gray-500">Thanh toán an toàn với Visa, Mastercard, JCB</p>
              </div>
              <div className="ml-auto flex gap-2">
                <div className="h-8 w-12 rounded bg-gray-200"></div>
                <div className="h-8 w-12 rounded bg-gray-200"></div>
                <div className="h-8 w-12 rounded bg-gray-200"></div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}

