"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Plus, Edit, Trash2, Search, Filter, ArrowUpDown, X } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
// import { products as mockProducts } from "@/lib/products"
import { Textarea } from "@/components/ui/textarea"
import { deleteAPI, getAPI, postAPI, putAPI } from "@/lib/api"
import { getCookie } from "@/lib/cookie"

// Product interface
interface Product {
  _id: string
  name: string
  actualPrice: number
  originalPrice?: number
  discount: number
  images: string[],
  category: string
  color: string
  description?: string
  stock: number
  isNew?: boolean
  installment?: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<any>(null)
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: string }>({
    show: false,
    message: "",
    type: "success",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [newImageUrl, setNewImageUrl] = useState("")
  const token = getCookie("token")

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

  // Lọc sản phẩm theo tìm kiếm và danh mục
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  // Sắp xếp sản phẩm
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortField === "name") {
      return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    } else if (sortField === "price") {
      return sortDirection === "asc" ? a.actualPrice - b.actualPrice : b.actualPrice - a.actualPrice
    } else if (sortField === "category") {
      return sortDirection === "asc" ? a.category.localeCompare(b.category) : b.category.localeCompare(a.category)
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

  // Mở dialog thêm sản phẩm mới
  const handleAddProduct = () => {
    setCurrentProduct({
      _id: "",
      name: "",
      actualPrice: 0,
      originalPrice: 0,
      discount: 0,
      images: [],
      category: "iPhone",
      color: "",
      description: "",
      stock: 0,
      isNew: false,
      installment: false,
    })
    setIsDialogOpen(true)
  }

  // Mở dialog chỉnh sửa sản phẩm
  const handleEditProduct = (product: any) => {
    setCurrentProduct({ ...product })
    setIsDialogOpen(true)
  }

  // Xử lý xóa sản phẩm
  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      await deleteAPI(`admin/products/${id}`, {
        Authorization: `Bearer ${token}`
      })
      setProducts((prev) => prev.filter((product) => product._id !== id))
      showNotification("Xóa sản phẩm thành công")
    }
  }

  // Calculate actual price based on original price and discount
  const calculateActualPrice = (originalPrice: number, discount: number): number => {
    return Math.round(originalPrice * (1 - discount / 100))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === "number") {
      const numValue = Number(value)
      setCurrentProduct((prev: any) => {
        const updatedProduct = { ...prev, [name]: numValue }

        // Automatically calculate price when originalPrice or discount changes
        if (name === "originalPrice" || name === "discount") {
          const originalPrice = name === "originalPrice" ? numValue : prev.originalPrice
          const discount = name === "discount" ? numValue : prev.discount
          updatedProduct.actualPrice = calculateActualPrice(originalPrice, discount)
        }

        return updatedProduct
      })
    } else {
      setCurrentProduct((prev: any) => ({ ...prev, [name]: value }))
    }
  }

  // Handle adding a new image URL
  const handleAddImage = () => {
    if (!currentProduct) return

    if (newImageUrl && newImageUrl.trim()) {
      setCurrentProduct((prev: any) => ({
        ...prev,
        images: [...(prev.images || []), newImageUrl.trim()],
      }))
      setNewImageUrl("") // Clear the input after adding
    }
  }

  // Handle removing an image
  const handleRemoveImage = (index: number) => {
    if (!currentProduct) return

    setCurrentProduct((prev: any) => ({
      ...prev,
      images: prev.images.filter((_: string, i: number) => i !== index),
    }))
  }

  // Xử lý lưu sản phẩm (thêm mới hoặc cập nhật)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    if (currentProduct._id) {
      // Cập nhật sản phẩm hiện có
      const data = {
        name: currentProduct.name,
        originalPrice: currentProduct.originalPrice,
        discount: currentProduct.discount,
        images: currentProduct.images,
        category: currentProduct.category,
        color: currentProduct.color,
        description: currentProduct.description,
        stock: currentProduct.stock,
        isNew: currentProduct.isNew,
        // installment: currentProduct.installment,
        actualPrice: calculateActualPrice(currentProduct.originalPrice, currentProduct.discount),
      }
      await putAPI(`admin/products/${currentProduct._id}`, data, {
        Authorization: `Bearer ${token}`
      })
      setProducts((prev) => prev.map((product) => (product._id === currentProduct._id ? { ...currentProduct } : product)))
      showNotification("Cập nhật sản phẩm thành công")
    } else {
      // Thêm sản phẩm mới
      const data = {
        name: currentProduct.name,
        originalPrice: currentProduct.originalPrice,
        discount: currentProduct.discount,
        images: currentProduct.images,
        category: currentProduct.category,
        color: currentProduct.color,
        description: currentProduct.description,
        stock: currentProduct.stock,
        isNew: currentProduct.isNew,
        // installment: currentProduct.installment,
        actualPrice: calculateActualPrice(currentProduct.originalPrice, currentProduct.discount),
      }
      await postAPI("admin/products", data, {
        Authorization: `Bearer ${token}`
      })
      setProducts((prev) => [...prev, currentProduct])
      showNotification("Thêm sản phẩm mới thành công")
    }

    setIsDialogOpen(false)
  }

  // Xử lý thay đổi trạng thái switch trong form
  const handleSwitchChange = (name: string, checked: boolean) => {
    setCurrentProduct((prev: any) => ({ ...prev, [name]: checked }))
  }

  useEffect(() => {
    // Fetch products from the server or use mock data
    const fetchProducts = async () => {
      // Simulate fetching data from an API
      const data = await getAPI("admin/products", {
        Authorization: `Bearer ${token}`
      }) // Replace with your API call
      setProducts(data)
    }

    fetchProducts()
  },[])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Link href="/admin" className="text-gray-500 hover:text-gray-700">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">Quản lý Sản phẩm</h1>
        </div>

        <Button onClick={handleAddProduct} className="gap-2">
          <Plus className="h-4 w-4" />
          Thêm sản phẩm mới
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
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">Tất cả danh mục</option>
              <option value="iPhone">iPhone</option>
              <option value="iPad">iPad</option>
              <option value="Mac">Mac</option>
              <option value="Watch">Watch</option>
            </select>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Hình ảnh</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("name")}>
                    Tên sản phẩm
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("category")}>
                    Danh mục
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("price")}>
                    Giá
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Giảm giá</TableHead>
                <TableHead>Tồn kho</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <div className="relative h-12 w-12 overflow-hidden rounded-md">
                      <Image
                        src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="flex gap-1 mt-1">
                        {product.isNew && <Badge className="bg-green-500 hover:bg-green-600">Mới</Badge>}
                        {product.installment && (
                          <Badge variant="outline" className="border-blue-500 text-blue-600">
                            Trả góp 0%
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{product.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-blue-600">{formatCurrency(product.actualPrice)}</div>
                      {product.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          {formatCurrency(product.originalPrice)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.discount > 0 && (
                      <Badge className="bg-red-500 hover:bg-red-600">-{product.discount}%</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.stock > 10 ? "outline" : "destructive"}>
                      {product.stock > 0 ? `Còn ${product.stock}` : "Hết hàng"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)} title="Chỉnh sửa">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteProduct(product._id)}
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

      {/* Dialog thêm/sửa sản phẩm */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentProduct?._id ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</DialogTitle>
            <DialogDescription>
              {currentProduct?._id ? "Cập nhật thông tin sản phẩm hiện có." : "Thêm sản phẩm mới vào hệ thống."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveProduct} className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên sản phẩm</Label>
                <Input id="name" name="name" value={currentProduct?.name || ""} onChange={handleInputChange} required />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Giá gốc</Label>
                  <Input
                    id="originalPrice"
                    name="originalPrice"
                    type="number"
                    value={currentProduct?.originalPrice || 0}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount">Giảm giá (%)</Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={currentProduct?.discount || 0}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Giá bán</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={currentProduct?.actualPrice || 0}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Danh mục</Label>
                  <select
                    id="category"
                    name="category"
                    value={currentProduct?.category || "iPhone"}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="iPhone">iPhone</option>
                    <option value="iPad">iPad</option>
                    <option value="Mac">Mac</option>
                    <option value="Watch">Watch</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Màu sắc</Label>
                  <Input
                    id="color"
                    name="color"
                    value={currentProduct?.color || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Số lượng tồn kho</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={currentProduct?.stock || 0}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả sản phẩm</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={currentProduct?.description || ""}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Hình ảnh sản phẩm</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập URL hình ảnh"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                  />

                  <Button 
                    type="button" variant="outline" size="sm" onClick={handleAddImage}
                    disabled={!newImageUrl.trim()}
                  >
                    Thêm ảnh
                  </Button>
                </div>

                {currentProduct?.images && currentProduct.images.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {currentProduct.images.map((img: string, index: number) => (
                      <div key={index} className="relative group">
                        <div className="relative h-24 w-full overflow-hidden rounded-md border">
                          <Image
                            src={img || "/placeholder.svg"}
                            alt={`Hình ảnh ${index + 1}`}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Chưa có hình ảnh sản phẩm</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isNew"
                  checked={currentProduct?.isNew || false}
                  onCheckedChange={(checked) => handleSwitchChange("isNew", checked)}
                />
                <Label htmlFor="isNew">Sản phẩm mới</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="installment"
                  checked={currentProduct?.installment || false}
                  onCheckedChange={(checked) => handleSwitchChange("installment", checked)}
                />
                <Label htmlFor="installment">Hỗ trợ trả góp 0%</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Hủy
                </Button>
              </DialogClose>
              <Button type="submit">{currentProduct?._id ? "Cập nhật" : "Thêm mới"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
