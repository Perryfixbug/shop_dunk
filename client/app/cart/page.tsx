"use client"

import { useEffect, useState, useContext } from "react"
import Link from "next/link"
import Image from "next/image"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { getCookie } from "@/lib/cookie"
import { deleteAPI, putAPI } from "@/lib/api"
import { CartContext } from "@/lib/cartContext"

export default function CartPage() {
  const token = getCookie("token")

  const { cartItems, updateCart } = useContext(CartContext)

  const updateQuantity = async (index: number, newQuantity: number) => {
    if (newQuantity < 1) return
    const newCartItems = await putAPI('carts', {
      productId: cartItems[index].productId._id,
      quantity: newQuantity,
    },
    {
        Authorization: `Bearer ${token}`,
    })
    updateCart(newCartItems)
  }

  const removeItem = async (index: number) => {
    try{
      console.log(cartItems[index]._id)
      const newCartItems = await deleteAPI(`carts/${cartItems[index]._id}`, {
        Authorization: `Bearer ${token}`,
      })

      updateCart(newCartItems)
    }catch(error) {
      console.error("Error removing item:", error)
    }
  }

  const subtotal = cartItems.reduce((total : number, item: any) => total + item.productId.actualPrice * item.quantity, 0)

  const shipping = subtotal > 2000000 ? 0 : 50000
  const total = subtotal + shipping

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Giỏ hàng của bạn</h1>
      {/* Giỏ hàng */}
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="mb-6 h-24 w-24 text-gray-400">
            <ShoppingBag className="h-24 w-24" />
          </div>
          <h2 className="mb-2 text-xl font-medium">Giỏ hàng trống</h2>
          <p className="mb-6 text-center text-gray-500">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
          <Link href="/">
            <Button>Tiếp tục mua sắm</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <h3 className="font-medium">Sản phẩm</h3>
                  </div>
                  <div className="col-span-2 text-center">
                    <h3 className="font-medium">Đơn giá</h3>
                  </div>
                  <div className="col-span-2 text-center">
                    <h3 className="font-medium">Số lượng</h3>
                  </div>
                  <div className="col-span-2 text-right">
                    <h3 className="font-medium">Thành tiền</h3>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item: any, index: number) => (
                  <div key={index} className="p-6">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-6">
                        <div className="flex gap-4">
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <Image
                              src={item?.productId.images[0] || "/placeholder.svg?height=80&width=80"}
                              alt={item.productId.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">{item.productId.name}</h4>
                            <p className="mt-1 text-sm text-gray-500">
                              {item.productId.category} | {item.productId.color}
                            </p>
                            <button
                              onClick={() => removeItem(index)}
                              className="mt-2 flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Xóa</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2 text-center">
                        <span className="font-medium">{formatCurrency(item.productId.actualPrice)}</span>
                      </div>

                      <div className="col-span-2">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 hover:bg-gray-100"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(index, Number.parseInt(e.target.value) || 1)}
                            className="h-8 w-12 border-y border-gray-300 bg-white text-center text-sm outline-none [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                          />
                          <button
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 hover:bg-gray-100"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      <div className="col-span-2 text-right">
                        <span className="font-medium">{formatCurrency(item.productId.actualPrice * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <Link href="/">
                <Button variant="outline">Tiếp tục mua sắm</Button>
              </Link>
              {/* <Button variant="outline" onClick={() => updateCart([])}>
                Xóa giỏ hàng
              </Button> */}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium mb-4">Tóm tắt đơn hàng</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className="font-medium">{shipping === 0 ? "Miễn phí" : formatCurrency(shipping)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg">
                  <span className="font-medium">Tổng cộng</span>
                  <span className="font-bold">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link href="/checkout">
                  <Button className="w-full">Tiến hành thanh toán</Button>
                </Link>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-2">Mã giảm giá</h4>
                <div className="flex gap-2">
                  <Input placeholder="Nhập mã giảm giá" />
                  <Button variant="outline" size="sm">
                    Áp dụng
                  </Button>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                <p>
                  Bằng cách tiến hành thanh toán, bạn đồng ý với{" "}
                  <Link href="/" className="text-blue-600 hover:underline">
                    Điều khoản dịch vụ
                  </Link>{" "}
                  và{" "}
                  <Link href="/" className="text-blue-600 hover:underline">
                    Chính sách bảo mật
                  </Link>{" "}
                  của chúng tôi.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

