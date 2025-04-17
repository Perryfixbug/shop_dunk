import type { Product } from "./types"

export const products: Product[] = [
  {
    id: "iphone-16e-128gb",
    name: "iPhone 16e 128GB",
    price: 16390000,
    originalPrice: 16990000,
    discount: 3,
    images: ["/placeholder.svg?height=300&width=300&text=iPhone+16e"],
    category: "iPhone",
    color: "Đen",
    installment: true,
  },
  {
    id: "iphone-16-pro-128gb",
    name: "iPhone 16 Pro 128GB",
    price: 25090000,
    originalPrice: 28990000,
    discount: 13,
    image: "/placeholder.svg?height=300&width=300&text=iPhone+16+Pro",
    category: "iPhone",
    color: "Bạc",
    installment: true,
  },
  {
    id: "iphone-16-pro-max-256gb",
    name: "iPhone 16 Pro Max 256GB",
    price: 30690000,
    originalPrice: 34990000,
    discount: 12,
    image: "/placeholder.svg?height=300&width=300&text=iPhone+16+Pro+Max",
    category: "iPhone",
    color: "Vàng",
    installment: true,
  },
  {
    id: "iphone-16-128gb",
    name: "iPhone 16 128GB",
    price: 18990000,
    originalPrice: 22990000,
    discount: 17,
    image: "/placeholder.svg?height=300&width=300&text=iPhone+16",
    category: "iPhone",
    color: "Hồng",
    installment: true,
  },
  {
    id: "ipad-pro-m2-11-inch",
    name: "iPad Pro M2 11 inch WiFi 128GB",
    price: 19990000,
    originalPrice: 23990000,
    discount: 16,
    image: "/placeholder.svg?height=300&width=300&text=iPad+Pro",
    category: "iPad",
    color: "Xám",
    isNew: true,
  },
  {
    id: "ipad-air-m2-11-inch",
    name: "iPad Air M2 11 inch WiFi 128GB",
    price: 15990000,
    originalPrice: 17990000,
    discount: 11,
    image: "/placeholder.svg?height=300&width=300&text=iPad+Air",
    category: "iPad",
    color: "Xanh",
  },
  {
    id: "ipad-10-64gb",
    name: "iPad 10 WiFi 64GB",
    price: 9990000,
    originalPrice: 11990000,
    discount: 16,
    image: "/placeholder.svg?height=300&width=300&text=iPad+10",
    category: "iPad",
    color: "Bạc",
  },
  {
    id: "ipad-mini-6-64gb",
    name: "iPad mini 6 WiFi 64GB",
    price: 11990000,
    originalPrice: 14990000,
    discount: 20,
    image: "/placeholder.svg?height=300&width=300&text=iPad+mini",
    category: "iPad",
    color: "Tím",
  },
  {
    id: "macbook-air-m3-13-inch",
    name: "MacBook Air M3 13 inch 8CPU 8GPU 8GB 256GB",
    price: 26990000,
    originalPrice: 29990000,
    discount: 10,
    image: "/placeholder.svg?height=300&width=300&text=MacBook+Air",
    category: "Mac",
    color: "Đen",
    isNew: true,
  },
  {
    id: "macbook-air-m2-15-inch",
    name: "MacBook Air M2 15 inch 8CPU 10GPU 8GB 256GB",
    price: 31990000,
    originalPrice: 36990000,
    discount: 13,
    image: "/placeholder.svg?height=300&width=300&text=MacBook+Air+15",
    category: "Mac",
    color: "Bạc",
  },
  {
    id: "macbook-pro-m3-14-inch",
    name: "MacBook Pro M3 14 inch 8CPU 10GPU 8GB 512GB",
    price: 39990000,
    originalPrice: 44990000,
    discount: 11,
    image: "/placeholder.svg?height=300&width=300&text=MacBook+Pro",
    category: "Mac",
    color: "Xám",
  },
  {
    id: "imac-m3-24-inch",
    name: "iMac M3 24 inch 8CPU 8GPU 8GB 256GB",
    price: 31990000,
    originalPrice: 34990000,
    discount: 8,
    image: "/placeholder.svg?height=300&width=300&text=iMac",
    category: "Mac",
    color: "Xanh",
  },
]

