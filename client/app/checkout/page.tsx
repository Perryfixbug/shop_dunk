"use client"

import type React from "react"

import { useContext, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import CheckoutSummary from "@/components/checkout-summary"
import PaymentMethodSelector from "@/components/payment-method-selector"
import ShippingMethodSelector from "@/components/shipping-method-selector"
import { CartContext } from "@/lib/cartContext"
import { getCookie } from "@/lib/cookie"
import { postAPI } from "@/lib/api"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { cartItems } = useContext(CartContext)
  const token = getCookie('token')

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    province: "",
    district: "",
    ward: "",
    note: "",
  })

  const [shippingMethod, setShippingMethod] = useState("standard")
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const subtotal = cartItems.reduce((total: number, item: any) => total + item.productId.actualPrice * item.quantity, 0)

  const shippingCost = shippingMethod === "express" ? 100000 : 50000
  const total = subtotal + shippingCost

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const requiredFields = ["fullName", "phone", "email", "address", "province", "district", "ward"]
    const emptyFields = requiredFields.filter((field) => !formData[field as keyof typeof formData])

    if (emptyFields.length > 0) {
      toast({
        title: "Vui lòng điền đầy đủ thông tin",
        description: "Các trường bắt buộc không được để trống",
        variant: "destructive",
      })
      return
    }

    // Process payment
    setIsProcessing(true)

    try {
      // Simulate API call
      const data = {
        items: cartItems.map((item: any) => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.actualPrice,
        })),
        total: subtotal,
        status: 'Chờ xác nhận',
        shippingAddress: `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.province}`,
      }
      console.log(data)
      await postAPI('bills', data,
        {
          Authorization: `Bearer ${token}`,
      })


      if (paymentMethod === "cod") {
        // For COD, just redirect to success page
        router.push("/checkout/success?orderId=ORD" + Math.floor(Math.random() * 1000000))
      } else if (paymentMethod === "banking") {
        // For banking, show banking information
        router.push("/checkout/banking?amount=" + total)
      } else {
        // For card payment, redirect to success after "processing"
        router.push("/checkout/success?orderId=ORD" + Math.floor(Math.random() * 1000000))
      }
    } catch (error) {
      toast({
        title: "Lỗi thanh toán",
        description: "Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/cart" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Quay lại giỏ hàng
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-8">Thanh toán</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Information */}
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 flex items-center">
                <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                <h2 className="font-medium">Thông tin giao hàng</h2>
              </div>

              <div className="p-6 grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      Họ và tên <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Nguyễn Văn A"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Số điện thoại <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0912345678"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@gmail.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    Địa chỉ <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Số nhà, tên đường"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="province">
                      Tỉnh/Thành phố <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="province"
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      placeholder="Hồ Chí Minh"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district">
                      Quận/Huyện <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      placeholder="Quận 1"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ward">
                      Phường/Xã <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="ward"
                      name="ward"
                      value={formData.ward}
                      onChange={handleInputChange}
                      placeholder="Phường Bến Nghé"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Ghi chú</Label>
                  <Textarea
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <ShippingMethodSelector selectedMethod={shippingMethod} onSelectMethod={setShippingMethod} />

            {/* Payment Method */}
            <PaymentMethodSelector selectedMethod={paymentMethod} onSelectMethod={setPaymentMethod} />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <CheckoutSummary
              cartItems={cartItems}
              subtotal={subtotal}
              shippingAddress={`${formData.address}, ${formData.ward}, ${formData.district}, ${formData.province}`}
              shippingCost={shippingCost}
              total={total}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </form>
    </div>
  )
}

