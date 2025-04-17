import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-zinc-100 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Thông tin</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:underline">
                  Tin tức
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm hover:underline">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm hover:underline">
                  Check IMEI
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm hover:underline">
                  Phương thức thanh toán
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm hover:underline">
                  Bảo hành và sửa chữa
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm hover:underline">
                  Tuyển dụng
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Chính sách</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:underline">
                  Trả góp
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm hover:underline">
                  Giao hàng
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm hover:underline">
                  Đổi trả
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm hover:underline">
                  Bảo hành
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm hover:underline">
                  Hủy giao dịch
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm hover:underline">
                  Bảo mật thông tin
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                <span className="text-sm">
                  Tầng 4, Tòa nhà Flemington, 182 Lê Đại Hành, phường 15, quận 11, Tp. Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-gray-600" />
                <span className="text-sm">1900.6626</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-600" />
                <span className="text-sm">support@shopdunk.com</span>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="font-medium text-sm mb-3">Kết nối với chúng tôi</h4>
              <div className="flex gap-4">
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  <Youtube className="h-5 w-5" />
                </Link>
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  <Twitter className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Đăng ký nhận tin</h3>
            <p className="text-sm mb-4">Đăng ký để nhận thông tin về sản phẩm mới và khuyến mãi đặc biệt.</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
              >
                Đăng ký
              </button>
            </form>

            <div className="mt-6">
              <h4 className="font-medium text-sm mb-3">Phương thức thanh toán</h4>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="h-8 w-12 rounded bg-gray-200"></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} ShopDunk. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  )
}

