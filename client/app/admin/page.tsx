"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ImageIcon, Package, Users, LogOut, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { deleteCookie, getCookie } from "@/lib/cookie"
import { getAPI } from "@/lib/api"

interface Stats{
  userCount: number,
  newUserCount: number,
  productCount: number,
  outOfStockCount: number,
  billCount: number,
  newBillCount: number,
  totalRevenue: number,
  soldProductsCount: number,
  tenNewBills: {
    _id: string
    userId:{
      _id: string,
      firstName: string
      lastName: string
    }
    createdAt: string,
    status: string
    total: number
  }[]
}

export default function AdminPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>()


  // Giả lập đăng xuất
  const handleLogout = () => {
    router.push("/")
    deleteCookie("token") // Xóa cookie đăng nhập
  }


  const token = getCookie("token")
  useEffect(() => {
    const fetchStats = async () => {
      const data = await getAPI("admin/stats",{
        Authorization: `Bearer ${token}`
      })
      setStats(data)
    }
    fetchStats()
  },[])

  const billIncrease = stats?.billCount ? Math.round((stats.billCount - stats.newBillCount) / stats.billCount * 100) : 0
  const userIncrease = stats?.userCount ? Math.round((stats.userCount - stats.newUserCount) / stats.userCount * 100) : 0
  const revenue = formatCurrency(stats?.totalRevenue || 0)


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Trang quản trị</h1>
        <Button variant="outline" size="sm" className="gap-2" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Link href="/admin/products">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-lg font-medium">Quản lý Sản phẩm</CardTitle>
              <Package className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <CardDescription>Quản lý sản phẩm, danh mục, giá cả và tồn kho.</CardDescription>
              <div className="mt-4 text-sm text-gray-500">
                <div className="flex items-center justify-between">
                  <span>Tổng số sản phẩm:</span>
                  <span className="font-medium">{stats?.productCount}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span>{stats?.outOfStockCount}</span>
                  <span className="font-medium text-red-500">12</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/orders">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-lg font-medium">Quản lý Đơn hàng</CardTitle>
              <ShoppingCart className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <CardDescription>Quản lý đơn hàng, trạng thái và thanh toán.</CardDescription>
              <div className="mt-4 text-sm text-gray-500">
                <div className="flex items-center justify-between">
                  <span>Tổng số đơn hàng:</span>
                  <span className="font-medium">{stats?.billCount}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span>Đơn hàng mới:</span>
                  <span className="font-medium text-green-500">{stats?.newBillCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/users">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-lg font-medium">Quản lý Người dùng</CardTitle>
              <Users className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <CardDescription>Quản lý tài khoản người dùng, phân quyền và thông tin.</CardDescription>
              <div className="mt-4 text-sm text-gray-500">
                <div className="flex items-center justify-between">
                  <span>Tổng số người dùng:</span>
                  <span className="font-medium">{stats?.userCount}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span>Người dùng mới (30 ngày):</span>
                  <span className="font-medium text-green-500">{stats?.newUserCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Thống kê tổng quan</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Tổng đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.billCount}</div>
              <p className="text-xs text-green-500 mt-1">{`+${billIncrease}% so với tháng trước`}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Doanh thu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{revenue}</div>
              {/* <p className="text-xs text-green-500 mt-1">+8% so với tháng trước</p> */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Sản phẩm bán ra</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.soldProductsCount}</div>
              {/* <p className="text-xs text-green-500 mt-1">+12% so với tháng trước</p> */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Khách hàng mới</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.userCount}</div>
              <p className="text-xs text-green-500 mt-1">{`+${userIncrease}% so với tháng trước`}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Đơn hàng gần đây</CardTitle>
              <Link href="/admin/orders">
                <Button variant="outline" size="sm">
                  Xem tất cả
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn hàng</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Ngày đặt</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Tổng tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.tenNewBills.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">
                      <Link href={`/admin/orders/${order._id}`} className="hover:underline">
                        {order._id}
                      </Link>
                    </TableCell>
                    <TableCell>{order.userId.firstName+" "+order.userId.lastName}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleString('vi-VN')}</TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
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
