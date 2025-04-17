"use client"

import { use, useState, useContext } from "react"
import Link from "next/link"
import { Search, ShoppingBag, User, ChevronDown, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CartContext } from "@/lib/cartContext"
import SearchBox  from "@/components/search-box"

export default function Header() {
  
  const {cartCount} = useContext(CartContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-zinc-800 text-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 md:gap-6">
          {/* Giao diện mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/category/iPhone" className="text-lg font-medium hover:text-gray-300">
                  iPhone
                </Link>
                <Link href="/category/iPad" className="text-lg font-medium hover:text-gray-300">
                  iPad
                </Link>
                <Link href="/" className="text-lg font-medium hover:text-gray-300">
                  Mac
                </Link>
                <Link href="/" className="text-lg font-medium hover:text-gray-300">
                  Watch
                </Link>
                <Link href="/" className="text-lg font-medium hover:text-gray-300">
                  Âm thanh
                </Link>
                <Link href="/" className="text-lg font-medium hover:text-gray-300">
                  Phụ kiện
                </Link>

              </nav>
            </SheetContent>
          </Sheet>

          {/* Giao diện Desktop */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-white">
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="hidden font-bold md:inline-block">SHOPDUNK</span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/category/iPhone" className="text-sm font-medium hover:text-gray-300">
              iPhone
            </Link>
            <Link href="/category/iPad" className="text-sm font-medium hover:text-gray-300">
              iPad
            </Link>
            <Link href="/category/Mac" className="text-sm font-medium hover:text-gray-300">
              Mac
            </Link>
            <Link href="/category/Watch" className="text-sm font-medium hover:text-gray-300">
              Watch
            </Link>
            <Link href="/category/Amthanh" className="text-sm font-medium hover:text-gray-300">
              Âm thanh
            </Link>
            <Link href="/category/Phukien" className="text-sm font-medium hover:text-gray-300">
              Phụ kiện
            </Link>
            
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <SearchBox />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="text-white relative">
              <ShoppingBag className="h-5 w-5" />

              {/* Số lượng sản phẩm trong giỏ hàng */}
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="text-white">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center ml-2">
            <span className="text-xs font-medium">VN</span>
            <span className="mx-1 text-xs">|</span>
            <span className="text-xs font-medium">EN</span>
          </div>
        </div>
      </div>

      {/* Mobile search box */}
      {isMenuOpen && (
        <div className="md:hidden p-4 bg-zinc-700">
          <SearchBox />
        </div>
      )}
    </header>
  )
}

