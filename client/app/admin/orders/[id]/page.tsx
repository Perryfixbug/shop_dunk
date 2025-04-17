"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { getAPI, putAPI } from "@/lib/api"
import { getCookie } from "@/lib/cookie"
const token = getCookie("token")

export default function OrderDetailPage() {
  const params = useParams()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [newStatus, setNewStatus] = useState("")

  useEffect(() => {
    // Tìm đơn hàng theo ID

    const findOrder = async () => {
      try{
        const orders = await getAPI('admin/bills', {
          Authorization: `Bearer ${token}`,
        })
        const foundOrder = orders.find((o: any) => o._id === params.id)
        if (foundOrder) {
          setOrder(foundOrder)
          setNewStatus(foundOrder.status)
        }
        setLoading(false)
      }catch (error) {
        console.error("Error fetching orders:", error)
      }
    }
    findOrder()
  }, [params.id])

  // Xử lý cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async (status: string) => {
    await putAPI(`admin/bills/${order._id}`, {
      status: status,
    }, {
      Authorization: `Bearer ${token}`,
    })

    setOrder((prev: any) => ({
      ...prev,
      status: status,
    }))
    setNewStatus(status)
    toast.success('Cập nhật trạng thái đơn hàng thành công!', {
      duration: 2000,
      icon: '🫶',
      description: status,
    })
  }

  // Định dạng ngày giờ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Đang tải...</div>
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/admin/orders" className="text-gray-500 hover:text-gray-700">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">Không tìm thấy đơn hàng</h1>
        </div>
        <p>Đơn hàng không tồn tại hoặc đã bị xóa.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/admin/orders" className="text-gray-500 hover:text-gray-700">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{order.id}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Thông tin đơn hàng */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Thông tin đơn hàng</span>
                <OrderStatusBadge status={order.status} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Ngày đặt hàng</h3>
                    <p className="mt-1">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Trạng thái</h3>
                    <div className="mt-1">
                      <select
                        value={newStatus}
                        onChange={(e) => handleUpdateStatus(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2"
                      >
                        <option value="Chờ xác nhận">Chờ xác nhận</option>
                        <option value="Đang xử lý">Đang xử lý</option>
                        <option value="Đang giao hàng">Đang giao hàng</option>
                        <option value="Đã giao hàng">Đã giao hàng</option>
                        <option value="Đã hủy">Đã hủy</option>
                      </select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Sản phẩm</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Hình ảnh</TableHead>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead className="text-right">Đơn giá</TableHead>
                        <TableHead className="text-right">Số lượng</TableHead>
                        <TableHead className="text-right">Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="relative h-16 w-16 overflow-hidden rounded-md">
                              <Image
                                src={item.productId?.images[0] || "/placeholder.svg"}
                                alt={item?.productId.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item?.productId.name}</div>
                              <div className="text-sm text-gray-500">{item?.productId.color}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(item?.productId.actualPrice)}</TableCell>
                          <TableCell className="text-right">{item?.quantity}</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(item?.productId.actualPrice * item?.quantity)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <Separator />

                <div className="flex justify-between font-medium">
                  <span>Tổng cộng:</span>
                  <span className="text-lg">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Thông tin khách hàng */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin khách hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Họ tên</h3>
                  <p className="mt-1 font-medium">{order.userId.firstName+" "+order.userId.lastName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Số điện thoại</h3>
                  <p className="mt-1">{order.userId.phone}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Địa chỉ giao hàng</h3>
                  <p className="mt-1">{order.shippingAddress}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Component hiển thị trạng thái đơn hàng
function OrderStatusBadge({ status }: { status: string }) {
  let color = "bg-gray-100 text-gray-800"
  let label = "Không xác định"

  switch (status) {
    case "Chờ xác nhận":
      color = "bg-yellow-100 text-yellow-800"
      label = "Chờ xác nhận"
      break
    case "Đang xử lý":
      color = "bg-blue-100 text-blue-800"
      label = "Đang xử lý"
      break
    case "Đang giao hàng":
      color = "bg-purple-100 text-purple-800"
      label = "Đang giao hàng"
      break
    case "Đã giao hàng":
      color = "bg-green-100 text-green-800"
      label = "Đã giao hàng"
      break
    case "Đã hủy":
      color = "bg-red-100 text-red-800"
      label = "Đã hủy"
      break
  }

  return <Badge className={color}>{label}</Badge>
}
