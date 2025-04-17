"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getAPI } from "@/lib/api"
// import { products } from "@/lib/products"

export default function SearchBox() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  // Xử lý click bên ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Cập nhật gợi ý khi searchTerm thay đổi
  useEffect(() => {
    const findProducts = async () => {
        try{
            const products = await getAPI("products")
            console.log(products)
            if (searchTerm.length > 1) {
                const filtered = products
                  .filter((product: any) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .slice(0, 5) // Giới hạn 5 gợi ý
                setSuggestions(filtered)
                setIsOpen(true)
              } else {
                setSuggestions([])
                setIsOpen(false)
              }
        }catch (error) {
            console.error("Error fetching products:", error)
        }
    }
    findProducts()
  }, [searchTerm])

  // Xử lý tìm kiếm
  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
      setIsOpen(false)
    }
  }

  // Xử lý nhấn Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  // Xử lý chọn gợi ý
  const handleSuggestionClick = (productId: string) => {
    router.push(`/products/${productId}`)
    setIsOpen(false)
    setSearchTerm("")
  }

  // Xóa từ khóa tìm kiếm
  const handleClearSearch = () => {
    setSearchTerm("")
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10 w-full md:w-[300px] text-black"
          onFocus={() => searchTerm.length > 1 && setIsOpen(true)}
        />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg z-50 border border-gray-200">
          <ul className="py-2">
            {suggestions.map((product) => (
              <li key={product._id}>
                <button
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-gray-800"
                  onClick={() => handleSuggestionClick(product._id)}
                >
                  <Search className="h-3 w-3 text-gray-500" />
                  <span>{product.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
