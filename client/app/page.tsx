import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { ChevronRight } from "lucide-react"
import { getAPI } from "@/lib/api"

export default async function Home() {
  // Fetch products from the server
  const products = await getAPI("products")

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Hero Banner */}
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden">
        <Image
          src="https://doanhnghiep.shopdunk.com/Content/images/Banner1.png"
          alt="iPhone 16 Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/25 text-white p-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center">iPhone 16 Mới Ra Mắt</h1>
          <p className="text-lg md:text-xl mb-6 text-center max-w-2xl">
            Trải nghiệm công nghệ đỉnh cao với bộ sưu tập iPhone 16 mới nhất
          </p>
          <Button size="lg" className="bg-white text-black hover:bg-gray-200">
            <Link href={"category/iPhone"}>Mua ngay</Link>
          </Button>
        </div>
      </div>

      {/* iPhone Section */}
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center">iPhone</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.filter((product: any) => product.category === "iPhone").slice(0, 4).map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Link href="category/iPhone">
            <Button variant="outline" className="flex items-center gap-1">
              Xem tất cả iPhone
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="container mx-auto px-4">
        <div className="relative h-[200px] md:h-[250px] w-full overflow-hidden rounded-xl">
          <Image src="https://www.gearpatrol.com/wp-content/uploads/sites/2/2024/09/apple-watch-compared-4-jpg.webp?resize=1920,1080" alt="Khuyến mãi đặc biệt" fill className="object-cover" />
          <div className="absolute inset-0 flex flex-col items-start justify-center bg-gradient-to-r from-black/60 to-transparent text-white p-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Ưu đãi đặc biệt</h3>
            <p className="text-lg mb-4 max-w-md">Giảm đến 20% cho tất cả sản phẩm Apple Watch trong tháng này</p>
            <Button className="bg-white text-black hover:bg-gray-200">Xem ngay</Button>
          </div>
        </div>
      </div>

      {/* iPad Section */}
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center">iPad</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.filter((product: any) => product.category === "iPad").slice(0,4).map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Link href="category/iPad">
            <Button variant="outline" className="flex items-center gap-1">
              Xem tất cả iPad
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Mac Section */}
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center">Mac</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.filter((product: any) => product.category === "Mac").slice(0,4).map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Link href="category/Mac">
            <Button variant="outline" className="flex items-center gap-1">
              Xem tất cả Mac
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Watch section */}
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center">Watch</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.filter((product: any) => product.category === "Watch").slice(0,4).map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Link href="category/Watch">
            <Button variant="outline" className="flex items-center gap-1">
              Xem tất cả Watch
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Âm thanh Section */}
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center">Âm thanh</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.filter((product: any) => product.category === "Âm thanh").slice(0,4).map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Link href="category/Amthanh">
            <Button variant="outline" className="flex items-center gap-1">
              Xem tất cả Âm thanh
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Phụ kiện Section */}
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center">Phụ kiện</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.filter((product: any) => product.category === "Phụ kiện").slice(0,4).map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Link href="category/Phukien">
            <Button variant="outline" className="flex items-center gap-1">
              Xem tất cả Phụ kiện
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Máy lướt section */}
      
      {/* Features */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-200">
            <div className="mb-4 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Sản phẩm chính hãng</h3>
            <p className="text-sm text-gray-600">Cam kết 100% sản phẩm chính hãng, được nhập khẩu trực tiếp từ Apple</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-200">
            <div className="mb-4 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Giao hàng nhanh chóng</h3>
            <p className="text-sm text-gray-600">Giao hàng trong vòng 24h đối với khu vực nội thành Hà Nội và TP.HCM</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-200">
            <div className="mb-4 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Bảo hành toàn diện</h3>
            <p className="text-sm text-gray-600">Bảo hành chính hãng 12 tháng và hỗ trợ kỹ thuật trọn đời</p>
          </div>
        </div>
      </div>
    </div>
  )
}

