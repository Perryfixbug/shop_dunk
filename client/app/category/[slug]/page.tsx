import Link from "next/link"
import { ChevronRight } from "lucide-react"
import ProductCard from "@/components/product-card"
import { getAPI } from "@/lib/api"

export default async function DetailPage({params}: {params: Promise<{ slug: string }>}) {
  const products = await getAPI("products")

  // Lọc ra các sản phẩm
  let { slug } = await params
  if(slug === 'Amthanh') slug = 'Âm thanh'
  if(slug === 'Phukien') slug = 'Phụ kiện'
  if(slug === 'Mayluot') slug = 'Máy lướt'
  const Products = products.filter((product : any) => product.category === slug)
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-900">
          Trang chủ
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium">{slug}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-8 text-center">{slug}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Products.map((product: any) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}

