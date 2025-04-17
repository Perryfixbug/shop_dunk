"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Plus, Edit, Trash2, Search, Filter, ArrowUpDown, Lock, Unlock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { deleteAPI, getAPI, postAPI, putAPI } from "@/lib/api"
import { getCookie } from "@/lib/cookie"
const token = getCookie("token")

interface User {
  _id: string,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  role: string,
  address: string,
  birthDate: string,
  orders: string[],
  status: string,
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: string }>({
    show: false,
    message: "",
    type: "success",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortField, setSortField] = useState("lastName")
  const [sortDirection, setSortDirection] = useState("asc")

  // Hiển thị thông báo
  const showNotification = (message: string, type = "success") => {
    setNotification({
      show: true,
      message,
      type,
    })

    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }))
    }, 3000)
  }

  // Lọc người dùng theo tìm kiếm, vai trò và trạng thái
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesStatus = filterStatus === "all" || user.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  // Sắp xếp người dùng
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortField === "name") {
      const nameA = `${a.firstName} ${a.lastName}`
      const nameB = `${b.firstName} ${b.lastName}`
      return sortDirection === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
    } else if (sortField === "email") {
      return sortDirection === "asc" ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email)
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

  // Mở dialog thêm người dùng mới
  const handleAddUser = async () => {
    setCurrentUser({
      _id: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      avatar: "/placeholder.svg?height=200&width=200",
      role: "user",
      status: "active",
      password: "",
      confirmPassword: "",
    })
    setIsDialogOpen(true)
  }

  // Mở dialog chỉnh sửa người dùng
  const handleEditUser = (user: any) => {
    setCurrentUser({
      ...user,
      password: "",
      confirmPassword: "",
    })
    setIsDialogOpen(true)
  }

  // Xử lý xóa người dùng
  const handleDeleteUser = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      await deleteAPI(`admin/users/${id}`, {
        Authorization: `Bearer ${token}`,
      })
      setUsers((prev) => prev.filter((user) => user._id !== id))
      showNotification("Xóa người dùng thành công")
    }
  }

  // Xử lý thay đổi trạng thái người dùng
  const handleToggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user._id === id) {
          const newStatus = user.status === "active" ? "inactive" : "active"
          return { ...user, status: newStatus }
        }
        return user
      }),
    )
    showNotification("Cập nhật trạng thái người dùng thành công")
  }

  // Xử lý khóa/mở khóa người dùng
  const handleToggleBlock = (id: string) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user._id === id) {
          const newStatus = user.status === "blocked" ? "active" : "blocked"
          return { ...user, status: newStatus }
        }
        return user
      }),
    )
    showNotification("Cập nhật trạng thái người dùng thành công")
  }

  // Xử lý lưu người dùng (thêm mới hoặc cập nhật)
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault()

    // Kiểm tra mật khẩu
    if (currentUser.password && currentUser.password !== currentUser.confirmPassword) {
      showNotification("Mật khẩu xác nhận không khớp", "error")
      return
    }

    if (currentUser._id) {
      // Cập nhật người dùng hiện 
      const data = {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phone: currentUser.phone,
        role: currentUser.role,
        address: currentUser.address,
        birthDate: currentUser.birthDate,
        orders: [],
        status: currentUser.status,
        password: currentUser.password,
      }
      await putAPI(`admin/users/${currentUser._id}`, data, {
        Authorization: `Bearer ${token}`,
      })
      setUsers((prev) =>
        prev.map((user) =>
          user._id === currentUser._id
            ? {
                ...currentUser,
                // Không lưu mật khẩu vào state
                password: undefined,
                confirmPassword: undefined,
              }
            : user,
        ),
      )
      showNotification("Cập nhật người dùng thành công")
    } else {
      // Thêm người dùng mới
      const data = {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phone: currentUser.phone,
        role: currentUser.role,
        address: currentUser.address,
        birthDate: currentUser.birthDate,
        orders: [],
        status: currentUser.status,
        password: currentUser.password,
      }
      await postAPI('admin/users', data, {
        Authorization: `Bearer ${token}`,
      })
      const newUser = {
        ...currentUser,
        createdAt: new Date().toISOString().split("T")[0],
        lastLogin: "-",
        orders: 0,
        // Không lưu mật khẩu vào state
        password: undefined,
        confirmPassword: undefined,
      }
      setUsers((prev) => [...prev, newUser])
      showNotification("Thêm người dùng mới thành công")
    }

    setIsDialogOpen(false)
  }

  // Xử lý thay đổi giá trị trong form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCurrentUser((prev: any) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAPI('admin/users',{
          Authorization: `Bearer ${token}`,
        })
        setUsers(data)
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }
    fetchUsers()
  },[])
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Link href="/admin" className="text-gray-500 hover:text-gray-700">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">Quản lý Người dùng</h1>
        </div>

        <Button onClick={handleAddUser} className="gap-2">
          <Plus className="h-4 w-4" />
          Thêm người dùng mới
        </Button>
      </div>

      {/* Thông báo */}
      {notification.show && (
        <Alert
          className={`mb-4 ${
            notification.type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
          }`}
        >
          <AlertDescription className={notification.type === "success" ? "text-green-600" : "text-red-600"}>
            {notification.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Bộ lọc và tìm kiếm */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="user">Người dùng</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
              <option value="blocked">Đã khóa</option>
            </select>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Avatar</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("name")}>
                    Tên người dùng
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("email")}>
                    Email
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("orders")}>
                    Đơn hàng
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                      <Image
                        src={"/placeholder.svg"}
                        alt={`${user.firstName} ${user.lastName}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                      {user.role === "admin" ? "Quản trị viên" : "Người dùng"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : user.status === "inactive"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {user.status === "active"
                        ? "Hoạt động"
                        : user.status === "inactive"
                          ? "Không hoạt động"
                          : "Đã khóa"}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.orders.length}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleStatus(user._id)}
                        title={user.status === "active" ? "Vô hiệu hóa" : "Kích hoạt"}
                      >
                        {user.status === "active" ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)} title="Chỉnh sửa">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteUser(user._id)}
                        title="Xóa"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog thêm/sửa người dùng */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentUser?._id ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}</DialogTitle>
            <DialogDescription>
              {currentUser?._id ? "Cập nhật thông tin người dùng hiện có." : "Thêm người dùng mới vào hệ thống."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveUser} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Họ</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={currentUser?.firstName || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Tên</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={currentUser?.lastName || ""}
                  onChange={handleInputChange}
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
                value={currentUser?.email || ""}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input id="phone" name="phone" value={currentUser?.phone || ""} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Vai trò</Label>
              <select
                id="role"
                name="role"
                value={currentUser?.role || "user"}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="user">Người dùng</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <select
                id="status"
                name="status"
                value={currentUser?.status || "active"}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
                <option value="blocked">Đã khóa</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {currentUser?.id ? "Mật khẩu mới (để trống nếu không thay đổi)" : "Mật khẩu"}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={currentUser?.password || ""}
                onChange={handleInputChange}
                required={!currentUser?.id}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={currentUser?.confirmPassword || ""}
                onChange={handleInputChange}
                required={!currentUser?._id || !!currentUser?.password}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Hủy
                </Button>
              </DialogClose>
              <Button type="submit">{currentUser?._id ? "Cập nhật" : "Thêm mới"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
