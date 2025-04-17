import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight, Heart, ShoppingBag, Truck, Shield, RotateCcw, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/utils"
import ProductCard from "@/components/product-card"
import { getAPI } from "@/lib/api"
import AddToCartSection  from "@/components/addtocart-section"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  
  const products = await getAPI("products")
  const product = products.find((p: any) => p._id === id)
  // product.discountedPrice = product.discount > 0 ? product.price - (product.price * product.discount) / 100 : product.price

  if (!product) {
    notFound()
  }

  const relatedProducts = products.filter((p: any) => p.category === product.category && p._id !== product._id).slice(0, 4)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-900">
          Trang chủ
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/" className="hover:text-gray-900">
          {product.category}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-gray-200">
            {product.discount > 0 && (
              <Badge className="absolute left-4 top-4 z-10 bg-red-500 hover:bg-red-600">Giảm {product.discount}%</Badge>
            )}

            {product.isNew && (
              <Badge className="absolute right-4 top-4 z-10 bg-green-500 hover:bg-green-600">Mới</Badge>
            )}

            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
              style={{ objectFit: "cover"}}
            />
          </div>

          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                className="relative aspect-square w-full overflow-hidden rounded-md border border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <Image
                  src={product.images[i] || `/placeholder.svg?height=100&width=100&text=${i}`}
                  alt={`${product.name} - Ảnh ${i}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`h-5 w-5 ${star <= 4 ? "text-yellow-400" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">4.0 (120 đánh giá)</span>
              </div>
              <span className="text-sm text-gray-600">Đã bán: 1.5k</span>
            </div>

            <div className="flex items-end gap-3 mb-6">
              <span className="text-3xl font-bold text-blue-600">{formatCurrency(product.actualPrice)}</span>
              {product.discount > 0 && (
                <span className="text-lg text-gray-500 line-through">{formatCurrency(product.originalPrice)}</span>
              )}
              {product.discount > 0 && <Badge className="bg-red-500 hover:bg-red-600">-{product.discount}%</Badge>}
            </div>
          </div>
          
          {/* Phần thêm sản phẩm, để ở client */}
          <AddToCartSection product={product} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
              <Truck className="h-5 w-5 text-gray-600" />
              <div>
                <h4 className="text-sm font-medium">Giao hàng miễn phí</h4>
                <p className="text-xs text-gray-500">Cho đơn hàng từ 2 triệu</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
              <Shield className="h-5 w-5 text-gray-600" />
              <div>
                <h4 className="text-sm font-medium">Bảo hành chính hãng</h4>
                <p className="text-xs text-gray-500">12 tháng tại trung tâm bảo hành</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
              <RotateCcw className="h-5 w-5 text-gray-600" />
              <div>
                <h4 className="text-sm font-medium">Đổi trả 30 ngày</h4>
                <p className="text-xs text-gray-500">Nếu sản phẩm lỗi do nhà sản xuất</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
              <Check className="h-5 w-5 text-gray-600" />
              <div>
                <h4 className="text-sm font-medium">Sản phẩm chính hãng</h4>
                <p className="text-xs text-gray-500">100% hàng chính hãng Apple</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger
            value="description"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent py-3 px-4"
          >
            Mô tả sản phẩm
          </TabsTrigger>
          <TabsTrigger
            value="specs"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent py-3 px-4"
          >
            Thông số kỹ thuật
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent py-3 px-4"
          >
            Đánh giá (120)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="pt-6">
          <div className="prose max-w-none">
            <p>{product.name} là sản phẩm mới nhất từ Apple với nhiều cải tiến vượt trội về hiệu năng và camera.</p>
            <p>
              Được trang bị chip A16 Bionic mạnh mẽ, {product.name} mang đến trải nghiệm sử dụng mượt mà và nhanh chóng
              cho mọi tác vụ, từ lướt web, chơi game đến chỉnh sửa ảnh và video.
            </p>
            <p>
              Hệ thống camera được nâng cấp với cảm biến chính 48MP, cho phép chụp ảnh sắc nét trong mọi điều kiện ánh
              sáng. Camera Ultra Wide và Telephoto cũng được cải tiến, mang đến khả năng zoom quang học 3x và chụp góc
              siêu rộng ấn tượng.
            </p>
            <p>
              Màn hình Super Retina XDR với công nghệ ProMotion cho tốc độ làm mới 120Hz, mang đến trải nghiệm xem mượt
              mà và sắc nét. Công nghệ Dynamic Island thông minh giúp hiển thị thông báo và hoạt động theo cách trực
              quan.
            </p>
            <p>
              Pin dung lượng lớn cho thời gian sử dụng lên đến 29 giờ xem video, đáp ứng nhu cầu sử dụng cả ngày dài.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="specs" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium text-lg mb-4">Thông số cơ bản</h3>
              <div className="space-y-2">
                {[
                  { label: "Màn hình", value: "6.7 inch, Super Retina XDR, 120Hz" },
                  { label: "Chip", value: "A16 Bionic" },
                  { label: "RAM", value: "8GB" },
                  { label: "Bộ nhớ trong", value: "128GB" },
                  { label: "Camera sau", value: "Chính 48MP, Ultra Wide 12MP, Telephoto 12MP" },
                  { label: "Camera trước", value: "12MP, Face ID" },
                  { label: "Pin", value: "4400mAh, sạc nhanh 27W" },
                  { label: "Hệ điều hành", value: "iOS 17" },
                ].map((item, index) => (
                  <div key={index} className="flex py-2 border-b border-gray-100">
                    <span className="w-1/3 text-gray-600">{item.label}</span>
                    <span className="w-2/3 font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-4">Thông số chi tiết</h3>
              <div className="space-y-2">
                {[
                  { label: "Kích thước", value: "160.7 x 77.6 x 7.85 mm" },
                  { label: "Trọng lượng", value: "221g" },
                  { label: "Chất liệu", value: "Khung thép không gỉ, mặt lưng kính cường lực" },
                  { label: "Chống nước", value: "IP68" },
                  { label: "Công nghệ sạc", value: "Sạc nhanh, sạc không dây MagSafe" },
                  { label: "Cổng kết nối", value: "Lightning" },
                  { label: "Công nghệ âm thanh", value: "Stereo speakers" },
                  { label: "Bảo mật", value: "Face ID" },
                ].map((item, index) => (
                  <div key={index} className="flex py-2 border-b border-gray-100">
                    <span className="w-1/3 text-gray-600">{item.label}</span>
                    <span className="w-2/3 font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="pt-6">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="flex flex-col items-center p-6 border rounded-lg">
                  <h3 className="text-3xl font-bold mb-2">4.0</h3>
                  <div className="flex mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`h-5 w-5 ${star <= 4 ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Dựa trên 120 đánh giá</p>

                  <div className="w-full space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{rating}</span>
                        <div className="h-2 flex-1 rounded-full bg-gray-200 overflow-hidden">
                          <div
                            className="h-full bg-yellow-400"
                            style={{
                              width: `${
                                rating === 5
                                  ? "30"
                                  : rating === 4
                                    ? "45"
                                    : rating === 3
                                      ? "15"
                                      : rating === 2
                                        ? "7"
                                        : "3"
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {rating === 5
                            ? "30%"
                            : rating === 4
                              ? "45%"
                              : rating === 3
                                ? "15%"
                                : rating === 2
                                  ? "7%"
                                  : "3%"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full mt-6">Viết đánh giá</Button>
                </div>
              </div>

              <div className="md:w-2/3 space-y-6">
                {[1, 2, 3].map((review) => (
                  <div key={review} className="border rounded-lg p-6">
                    <div className="flex justify-between mb-4">
                      <div>
                        <h4 className="font-medium">Nguyễn Văn A</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= (review === 1 ? 5 : review === 2 ? 4 : 3)
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            {review === 1 ? "5.0" : review === 2 ? "4.0" : "3.0"}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">12/04/2023</span>
                    </div>

                    <p className="text-sm text-gray-700">
                      {review === 1
                        ? "Sản phẩm rất tốt, đúng như mô tả. Giao hàng nhanh, đóng gói cẩn thận. Camera chụp đẹp, pin trâu, màn hình sắc nét. Rất hài lòng với sản phẩm này."
                        : review === 2
                          ? "Sản phẩm tốt, đáng tiền. Tuy nhiên pin hơi tụt nhanh khi chơi game nặng. Nhìn chung vẫn rất ổn với mức giá này."
                          : "Sản phẩm tạm được, không quá xuất sắc như mong đợi. Camera chụp đẹp nhưng pin không được trâu lắm. Giao hàng nhanh."}
                    </p>
                  </div>
                ))}

                <Button variant="outline" className="w-full">
                  Xem thêm đánh giá
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

