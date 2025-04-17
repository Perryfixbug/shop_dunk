"use client"

import type React from "react"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { User, Package, LogOut, MapPin, Edit, Clock, ChevronRight, Save, X, Plus } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getCookie, deleteCookie } from "@/lib/cookie"
import { getAPI, putAPI } from "@/lib/api"

// const mockUser = {
//   firstName: "Nguyễn",
//   lastName: "Văn A",
//   email: "example@gmail.com",
//   phone: "0912345678",
//   birthDate: "1990-01-01",
//   avatar: "/placeholder.svg?height=200&width=200",
//   address: {
//     address: "123 Đường Lê Lợi",
//     ward: "Phường Bến Nghé",
//     district: "Quận 1",
//     province: "TP. Hồ Chí Minh",
//   },
// }

// // Giả lập dữ liệu đơn hàng
// const mockOrders = [
//   {
//     _id: "ORD123456",
//     date: "15/04/2023",
//     status: "Đã giao hàng",
//     total: 16390000,
//     items: [
//       {
//         _id: "1",
//         productId: {
//           _id: "iphone-16e-128gb",
//           name: "iPhone 16e 128GB",
//           price: 16390000,
//           originalPrice: 16990000,
//           discount: 3,
//           images: ["/placeholder.svg?height=300&width=300&text=iPhone+16e"],
//           category: "iPhone",
//           color: "Đen",
//           installment: true,
//         },
//         quantity: 1,
//         price: 16390000,
//       }
//     ]
//   }
// ]

interface User {
  firstName: string
  lastName: string
  email: string
  phone: string
  birthDate: string
  avatar: string
  address: {
    address: string
    ward: string
    district: string
    province: string
  }
}
interface Order {
  _id: string
  date: string
  status: string
  total: number
  items: {
    _id: string
    productId: {
      _id: string
      name: string
      actualPrice: number
      originalPrice: number
      discount: number
      images: string[]
      category: string
      color: string
      installment: boolean
    }
    quantity: number
    price: number
  }[]
}

export default function ProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [user, setUser] = useState<User>()
  const [orders, setOrders] = useState<Order[]>([])

  // State cho form chỉnh sửa thông tin
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    phone: user?.phone,
    birthDate: user?.birthDate,
  })

  // State cho form địa chỉ
  const [addressForm, setAddressForm] = useState({
    address: user?.address?.address || "",
    ward: user?.address?.ward || "",
    district: user?.address?.district || "",
    province: user?.address?.province || "",
  })

  // State cho thông báo
  const [notification, setNotification] = useState({
    show: false,
    type: "success",
    message: "",
  })

  // State cho dialog
  const [dialogType, setDialogType] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  //State for order filter
  const [orderStatusFilter, setOrderStatusFilter] = useState("all")
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null)

  const token = getCookie("token")
  useEffect(() => {
    const fetchUserData = async () => {
      try{
        const userData = await getAPI("users/me", {
          Authorization: `Bearer ${token}`,
        })
        setUser(userData)
        setOrders(userData.orders)
        setEditForm(userData)
      }catch (error) {
        console.error("Error fetching user data:", error)
      }
    }
    fetchUserData()
  }, [token])
  // Xử lý đăng xuất
  const handleLogout = () => {
    deleteCookie("token")
    localStorage.removeItem("cart")
    router.push("/login")
  }

  // Xử lý thay đổi form chỉnh sửa thông tin
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Xử lý lưu thông tin cá nhân
  const handleSaveProfile = async () => {
    setUser((prev) => ({
      ...prev,
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      email: editForm.email,
      phone: editForm.phone,
      birthDate: editForm.birthDate,
    }))
    await putAPI("users/me", {
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      email: editForm.email,
      phone: editForm.phone,
      birthDate: editForm.birthDate,
    },{
      Authorization: `Bearer ${token}`,
    })
    setIsEditing(false)
    showNotification("success", "Cập nhật thông tin thành công!")
  }

  // Xử lý thay đổi form địa chỉ
  const handleAddressFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Cập nhật hàm xử lý lưu địa chỉ
  const handleSaveAddress = async () => {
    // Cập nhật địa chỉ
    setUser((prev) => ({
      ...prev,
      address: { ...addressForm },
    }))
    await putAPI("users/me", {
      address: {
        address: addressForm.address,
        ward: addressForm.ward,
        district: addressForm.district,
        province: addressForm.province,
      },
    },{
      Authorization: `Bearer ${token}`,
    })

    // Đóng dialog
    setDialogType("")
    showNotification("success", "Cập nhật địa chỉ thành công!")
  }

  // Hiển thị thông báo
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({
      show: true,
      type,
      message,
    })

    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }))
    }, 3000)
  }

  // Thay đổi hàm chỉnh sửa địa chỉ
  // Thêm hàm mới
  const handleEditAddress = () => {
    setAddressForm({
      address: user?.address?.address || "",
      ward: user?.address?.ward || "",
      district: user?.address?.district || "",
      province: user?.address?.province || "",
    })
    setDialogType("address")
  }

  const handleCancelOrder = async (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId ? { ...order, status: "Đã hủy", cancelReason } : order,
      ),
    )
    showNotification("success", "Đơn hàng đã được hủy")
    setIsCancelDialogOpen(false)
    setOrderToCancel(null)

    await putAPI(`bills/${orderId}`, {
      status: "Đã hủy"
    }, {
      Authorization: `Bearer ${token}`,
    })
  }
  console.log(100);
  

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Tài khoản của tôi</h1>

      {/* Thông báo */}
      {notification.show && (
        <Alert
          className={`mb-4 ${notification.type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
        >
          <AlertDescription className={notification.type === "success" ? "text-green-600" : "text-red-600"}>
            {notification.message}
          </AlertDescription>
        </Alert>
      )}
      {/* Thông tin người dùng và nút bấm */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 p-6">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-200">
                  <Image src={user?.avatar || "/placeholder.svg"} alt="Avatar" fill className="object-cover" />
                </div>
                <div>
                  <h2 className="font-medium">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm ${
                    activeTab === "profile"
                      ? "bg-gray-100 font-medium text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <User className="h-5 w-5" />
                  Thông tin tài khoản
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm ${
                    activeTab === "orders"
                      ? "bg-gray-100 font-medium text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Package className="h-5 w-5" />
                  Đơn hàng của tôi
                </button>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                  Đăng xuất
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/*Kết thúc thông tin người dùng và nút bấm */}

        <div className="md:col-span-3">
          {/* Thông tin cá nhân */}
          {activeTab === "profile" && (
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                <h2 className="font-medium">Thông tin cá nhân</h2>
                {!isEditing ? (
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4" />
                    Chỉnh sửa
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4" />
                      Hủy
                    </Button>
                    <Button size="sm" className="gap-1" onClick={handleSaveProfile}>
                      <Save className="h-4 w-4" />
                      Lưu
                    </Button>
                  </div>
                )}
              </div>
              {/* Thông tin người dùng */}
              <div className="p-6">
                {!isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-500 text-sm">Họ và tên</Label>
                      <p className="font-medium mt-1">
                        {user?.firstName} {user?.lastName}
                      </p>
                    </div>

                    <div>
                      <Label className="text-gray-500 text-sm">Email</Label>
                      <p className="font-medium mt-1">{user?.email}</p>
                    </div>

                    <div>
                      <Label className="text-gray-500 text-sm">Số điện thoại</Label>
                      <p className="font-medium mt-1">{user?.phone}</p>
                    </div>

                    <div>
                      <Label className="text-gray-500 text-sm">Ngày sinh</Label>
                      <p className="font-medium mt-1">{new Date(user?.birthDate ?? '08/21/2004').toLocaleDateString("vi-VN")}</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Họ</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={editForm.firstName}
                        onChange={handleEditFormChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Tên</Label>
                      <Input id="lastName" name="lastName" value={editForm.lastName} onChange={handleEditFormChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={editForm.email}
                        onChange={handleEditFormChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input id="phone" name="phone" value={editForm.phone} onChange={handleEditFormChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Ngày sinh</Label>
                      <Input
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        value={editForm.birthDate || ""} 
                        onChange={handleEditFormChange}
                      />
                    </div>
                  </div>
                )}
                <Separator className="my-6" />

                {/* Địa chỉ giao hàng */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Địa chỉ giao hàng</h3>
                    {user?.address ? (
                      <Button variant="outline" size="sm" className="gap-1" onClick={handleEditAddress}>
                        <Edit className="h-4 w-4" />
                        Chỉnh sửa
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => {
                          setAddressForm({
                            address: "",
                            ward: "",
                            district: "",
                            province: "",
                          })
                          setDialogType("address")
                        }}
                      >
                        <Plus className="h-4 w-4" />
                        Thêm địa chỉ
                      </Button>
                    )}
                  </div>

                  {!user?.address ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center bg-gray-50 rounded-lg">
                      <MapPin className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-gray-500 mb-4">Bạn chưa thêm địa chỉ giao hàng.</p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setAddressForm({
                            address: "",
                            ward: "",
                            district: "",
                            province: "",
                          })
                          setDialogType("address")
                        }}
                      >
                        Thêm địa chỉ
                      </Button>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-gray-200 p-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 mt-0.5 text-gray-500" />
                        <div>
                          <p className="text-gray-600 mt-1">
                            {user.address.address}, {user.address.ward}, {user.address.district},{" "}
                            {user.address.province}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Đơn hàng */}
          {activeTab === "orders" && (
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                <h2 className="font-medium">Đơn hàng của tôi</h2>
                  {/* Add filter dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Lọc theo:</span>
                    <select
                      className="text-sm border border-gray-200 rounded-md px-2 py-1"
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value)}
                    >
                      <option value="all">Tất cả đơn hàng</option>
                      <option value="Chờ xác nhận">Chờ xác nhận</option>
                      <option value="Đang xử lý">Đang xử lý</option>
                      <option value="Đang giao hàng">Đang giao hàng</option>
                      <option value="Đã giao hàng">Đã giao hàng</option>
                      <option value="Đã hủy">Đã hủy</option>
                    </select>
                </div>
              </div>

              <div className="p-6">
                {orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Package className="h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Chưa có đơn hàng nào</h3>
                    <p className="text-gray-500 mb-6">Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!</p>
                    <Link href="/">
                      <Button>Mua sắm ngay</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders
                      .filter((order) => orderStatusFilter === "all" || order.status === orderStatusFilter)
                      .map((order) => (
                      <div key={order._id} className="rounded-lg border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="text-sm text-gray-500">Mã đơn hàng: </span>
                            <span className="font-medium">{order._id}</span>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-sm">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span>{order.date}</span>
                            </div>

                            <Badge status={order.status} />
                          </div>
                        </div>

                        <div className="space-y-4 p-4">
                          {order.items.map((item) => (
                            <div key={item._id} className="flex gap-4">
                              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <Image
                                  src={item.productId.images[0] || "/placeholder.svg?height=80&width=80"}
                                  alt={item.productId.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-medium">{item.productId.name}</h4>
                                <p className="mt-1 text-sm text-gray-500">Số lượng: 1</p>
                                <p className="mt-1 font-medium text-blue-600">{formatCurrency(item.productId.actualPrice)}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-gray-50 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="text-sm text-gray-500">Tổng tiền: </span>
                            <span className="font-medium">{formatCurrency(order.total)}</span>
                          </div>
                          
                          <div className="flex gap-2">
                              {/* Add cancel button for pending orders */}
                              {order.status === "Chờ xác nhận" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                  onClick={() => {
                                    // setOrderToCancel(order._id)
                                    // setCancelReason("")
                                    // setIsCancelDialogOpen(true)
                                    handleCancelOrder(order._id)
                                  }}
                                >
                                  Hủy đơn hàng
                                </Button>
                              )}

                          <Button variant="outline" size="sm" className="gap-1">
                            Chi tiết
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialog thêm/sửa địa chỉ */}
      <Dialog open={dialogType === "address"} onOpenChange={(open) => !open && setDialogType("")}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{user?.address ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">

            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ cụ thể</Label>
              <Textarea id="address" name="address" value={addressForm.address} onChange={handleAddressFormChange} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="province">Tỉnh/Thành phố</Label>
                <Input id="province" name="province" value={addressForm.province} onChange={handleAddressFormChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">Quận/Huyện</Label>
                <Input id="district" name="district" value={addressForm.district} onChange={handleAddressFormChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ward">Phường/Xã</Label>
                <Input id="ward" name="ward" value={addressForm.ward} onChange={handleAddressFormChange} />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button onClick={handleSaveAddress}>Lưu địa chỉ</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog hủy đơn hàng */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hủy đơn hàng</DialogTitle>
            <DialogDescription>Vui lòng cho chúng tôi biết lý do bạn muốn hủy đơn hàng này.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cancelReason">Lý do hủy đơn</Label>
              <Textarea
                id="cancelReason"
                placeholder="Vui lòng nhập lý do hủy đơn hàng..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsCancelDialogOpen(false)
                setOrderToCancel(null)
              }}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (orderToCancel) {
                  setOrders((prev) =>
                    prev.map((o) =>
                      o._id === orderToCancel
                        ? { ...o, status: "Đã hủy", cancelReason: cancelReason || "Không có lý do" }
                        : o,
                    ),
                  )
                  showNotification("success", "Hủy đơn hàng thành công")
                  setIsCancelDialogOpen(false)
                  setOrderToCancel(null)
                }
              }}
            >
              Xác nhận hủy đơn
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Badge({ status }: { status: string }) {
  let color = "bg-gray-100 text-gray-800"

  if (status === "Đã giao hàng") {
    color = "bg-green-100 text-green-800"
  } else if (status === "Đang giao hàng") {
    color = "bg-blue-100 text-blue-800"
  } else if (status === "Đã hủy") {
    color = "bg-red-100 text-red-800"
  } else if (status === "Chờ xác nhận") {
    color = "bg-yellow-100 text-yellow-800"
  } else if (status === "cancelled") {
    color = "bg-red-100 text-red-800"
  } else if (status === "pending") {
    color = "bg-yellow-100 text-yellow-800"
  }
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>{status}</span>
  )
}

