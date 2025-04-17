"use client"

import { Truck } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/utils"

interface ShippingMethodSelectorProps {
  selectedMethod: string
  onSelectMethod: (method: string) => void
}

export default function ShippingMethodSelector({ selectedMethod, onSelectMethod }: ShippingMethodSelectorProps) {
  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 flex items-center">
        <Truck className="h-5 w-5 text-gray-500 mr-2" />
        <h2 className="font-medium">Phương thức vận chuyển</h2>
      </div>

      <div className="p-6">
        <RadioGroup value={selectedMethod} onValueChange={onSelectMethod} className="space-y-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="standard" id="standard" />
            <Label htmlFor="standard" className="flex flex-1 justify-between cursor-pointer">
              <div>
                <span className="font-medium">Giao hàng tiêu chuẩn</span>
                <p className="text-sm text-gray-500">Nhận hàng trong 3-5 ngày</p>
              </div>
              <span className="font-medium">{formatCurrency(50000)}</span>
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="express" id="express" />
            <Label htmlFor="express" className="flex flex-1 justify-between cursor-pointer">
              <div>
                <span className="font-medium">Giao hàng nhanh</span>
                <p className="text-sm text-gray-500">Nhận hàng trong 1-2 ngày</p>
              </div>
              <span className="font-medium">{formatCurrency(100000)}</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}

