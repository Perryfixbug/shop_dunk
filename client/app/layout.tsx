import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { CartProvider } from "@/lib/cartContext" 
import { Toaster } from "sonner"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ShopDunk - Cửa hàng điện thoại chính hãng",
  description: "Cửa hàng điện thoại chính hãng với nhiều ưu đãi hấp dẫn",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  
  return (
    <html lang="vi">
      <body className={inter.className}>
        <CartProvider>
          <Header />
            <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>

        <Toaster
          richColors // màu sắc đẹp sẵn
          closeButton // hiện nút đóng
        />
      </body>
    </html>
  )
}




