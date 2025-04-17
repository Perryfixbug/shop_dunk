"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft, Search, Eye, ArrowUpDown, Filter, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { getCookie } from "@/lib/cookie"
import { getAPI } from "@/lib/api"
import { set } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


interface Order {
  _id: string,
  userId: {
    _id: string,
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
  },
  items: [
    {
      productId: string,
      quantity: number,
      price: number,
    },
  ],
  total: number,
  status: string,
  shippingAddress: string,
  createdAt: string,
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortField, setSortField] = useState("createdAt")
  const [sortDirection, setSortDirection] = useState("desc")
  const token = getCookie("token")

  // Lọc đơn hàng theo tìm kiếm
  // Lọc đơn hàng theo tìm kiếm và trạng thái
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId.phone.includes(searchTerm)

    const matchesStatus = filterStatus === "all" || order.status === filterStatus

    return matchesSearch && matchesStatus 
  })

   // Sắp xếp đơn hàng
   const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortField === "id") {
      return sortDirection === "asc" ? a._id.localeCompare(b._id) : b._id.localeCompare(a._id)
    } else if (sortField === "customerName") {
      return sortDirection === "asc"
        ? a.userId.firstName.localeCompare(b.userId.firstName) || a.userId.lastName.localeCompare(b.userId.lastName)
        : b.userId.firstName.localeCompare(a.userId.firstName) || b.userId.lastName.localeCompare(a.userId.lastName)
    } else if (sortField === "total") {
      return sortDirection === "asc" ? a.total - b.total : b.total - a.total
    } else if (sortField === "createdAt") {
      return sortDirection === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    return 0
  })
  // Xử lý sắp xếp
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
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

  useEffect(() => {
    const fetchOrders = async () => {
      try{
        const data = await getAPI('admin/bills', {
          Authorization: `Bearer ${token}`,
        })
        setOrders(data)
      }catch (error) {
        console.error("Error fetching orders:", error)
      }
    }
    fetchOrders()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/admin" className="text-gray-500 hover:text-gray-700">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Quản lý Đơn hàng</h1>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Tìm kiếm theo mã đơn, tên khách hàng, email, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái đơn hàng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="Chờ xác nhận">Chờ xác nhận</SelectItem>
                <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
                <SelectItem value="Đang giao hàng">Đang giao hàng</SelectItem>
                <SelectItem value="Đã giao hàng">Đã giao hàng</SelectItem>
                <SelectItem value="Đã hủy">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("id")}>
                    Mã đơn hàng
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("customerName")}>
                    Khách hàng
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">{order._id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.userId.firstName + " " + order.userId.lastName}</div>
                      <div className="text-sm text-gray-500">{order.userId.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>

                  <TableCell className="font-medium">{formatCurrency(order.total)}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        // onClick={() => handleViewOrder(order._id)}
                        title="Xem chi tiết"
                      >
                        <Link href={`/admin/orders/${order._id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="In hóa đơn"
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
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
