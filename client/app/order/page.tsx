"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, Plus, Minus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
// import { products } from "@/lib/products"
import { useToast } from "@/components/ui/use-toast"
import { getAPI, postAPI } from "@/lib/api"
import { getCookie } from "@/lib/cookie"


export default function OrderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const token = getCookie("token")
  const productId = searchParams.get("productId")
  const initialQuantity = Number.parseInt(searchParams.get("quantity") || "1")

  const [selectedProduct, setSelectedProduct] = useState({product: {
    _id: "",
    name: "",
    actualPrice: 0,
    color: "",
    images: [""],
    category: "",
    description: "",
  }, quantity: 1})

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const findProduct = async ()=> {
      const products = await getAPI("products")
      // Nếu có productId trong URL, thêm sản phẩm đó vào danh 
      if (productId) {
        const product = products.find((p: any) => p._id === productId)
        if (product) {
          console.log("Product found:", product);
          
          setSelectedProduct({
            product,
            quantity: initialQuantity,
          })
        }
      } 
    }
    findProduct()  
  }, [productId, initialQuantity])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return
    setSelectedProduct((prev) => ({
      ...prev,
      quantity: newQuantity,
    }))

  }


  const subtotal = selectedProduct.product
    ? selectedProduct.product.actualPrice * selectedProduct.quantity : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.fullName || !formData.phone || !formData.address) {
      toast({
        title: "Vui lòng điền đầy đủ thông tin",
        description: "Họ tên, số điện thoại và địa chỉ là bắt buộc",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      //Tạo bill
      const data = {
        items: [{productId: selectedProduct.product._id, quantity: selectedProduct.quantity, price: selectedProduct.product.actualPrice}],
        total: subtotal,
        status: 'Chờ xác nhận',
        shippingAddress: formData.address
      }
      console.log(data);
      await postAPI('bills', {
        items: [{productId: productId, quantity: selectedProduct.quantity, price: selectedProduct.product.actualPrice}],
        total: subtotal,
        status: 'Chờ xác nhận',
        shippingAddress: formData.address
      },{
        Authorization: `Bearer ${token}`,
      }
    )
    


      // Chuyển hướng đến trang thành công
      router.push(`/order/success?orderId=ORD${Math.floor(Math.random() * 1000000)}`)
    } catch (error) {
      toast({
        title: "Đặt hàng thất bại",
        description: "Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại sau.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href={productId ? `/products/${productId}` : "/cart"}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {productId ? "Quay lại sản phẩm" : "Quay lại giỏ hàng"}
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-8">Đặt hàng nhanh</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4">
                <h2 className="font-medium">Thông tin đặt hàng</h2>
              </div>

              <div className="p-6 space-y-6">
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@gmail.com"
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
                    placeholder="Địa chỉ đầy đủ: Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    required
                  />
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

            <Button
              type="submit"
              className="w-full md:w-auto md:min-w-[200px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Đặt hàng ngay"
              )}
            </Button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 overflow-hidden sticky top-4">
            <div className="bg-gray-50 px-6 py-4">
              <h2 className="font-medium">Sản phẩm đặt hàng</h2>
            </div>

            <div className="p-6">
              <div className="space-y-4 mb-6">
                {selectedProduct.product && (
                  <div className="flex items-start space-x-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <Image
                        src={selectedProduct?.product?.images[0] || "/placeholder.svg?height=80&width=80"}
                        alt={selectedProduct.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium">{selectedProduct.product.name}</h4>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{selectedProduct.product.color}</p>
                      <div className="mt-1 flex items-center">
                        <button
                          type="button"
                          onClick={() => updateQuantity(selectedProduct.quantity - 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 hover:bg-gray-100"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={selectedProduct.quantity}
                          onChange={(e) => updateQuantity(Number.parseInt(e.target.value) || 1)}
                          className="h-6 w-10 border-y border-gray-300 bg-white text-center text-xs outline-none [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <button
                          type="button"
                          onClick={() => updateQuantity(selectedProduct.quantity + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 hover:bg-gray-100"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <span className="ml-auto font-medium text-sm">
                          {formatCurrency(selectedProduct.product.actualPrice * selectedProduct.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className="font-medium">Tính khi giao hàng</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg">
                  <span className="font-medium">Tổng cộng</span>
                  <span className="font-bold">{formatCurrency(subtotal)}</span>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                <p>
                  * Phí vận chuyển sẽ được tính dựa trên địa chỉ giao hàng và được thông báo đến bạn trước khi giao
                  hàng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

