"use client"

import { useState, useContext } from "react";
import { CartContext } from "@/lib/cartContext";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {toast} from "sonner"
import { Label } from "@/components/ui/label";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { postAPI } from "@/lib/api";
import { getCookie } from "@/lib/cookie";


export default function AddToCartSection({ product }: any) {
  const { updateCart } = useContext(CartContext);
  const [color, setColor] = useState("black");
  const [storage, setStorage] = useState("128");

  // const { toast } = useToast();
  const handleAddToCart = async () => {
    try {
        const token = getCookie("token")
        const newCartItems = await postAPI("carts",{
            productId: product._id,
            quantity: 1,
        }, 
        {
            Authorization: `Bearer ${token}`,   
        });
        toast.success("Thêm sản phẩm thành công",{
            description: "Sản phẩm đã được thêm vào giỏ hàng.",
            duration: 2000,
            icon: '🛒'
        })
        updateCart(newCartItems);
        
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Màu sắc</h3>
        <RadioGroup value={color} onValueChange={setColor} className="flex flex-wrap gap-3">
          {["Đen", "Trắng", "Xanh", "Hồng"].map((c) => (
            <div key={c} className="flex items-center">
              <RadioGroupItem
                value={c.toLowerCase()}
                id={`color-${c.toLowerCase()}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`color-${c.toLowerCase()}`}
                className="flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 hover:bg-gray-50 cursor-pointer"
              >
                {c}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <h3 className="font-medium mb-3">Dung lượng</h3>
        <RadioGroup value={storage} onValueChange={setStorage} className="flex flex-wrap gap-3">
          {["128GB", "256GB", "512GB", "1TB"].map((s) => (
            <div key={s} className="flex items-center">
              <RadioGroupItem
                value={s.replace("GB", "").replace("TB", "000")}
                id={`storage-${s.toLowerCase()}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`storage-${s.toLowerCase()}`}
                className="flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 hover:bg-gray-50 cursor-pointer"
              >
                {s}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <Button size="lg" className="gap-2" onClick={handleAddToCart}>
            <ShoppingBag className="h-5 w-5" />
            Thêm vào giỏ hàng
          </Button>
          <Link href={`/order?productId=${product._id}&quantity=1`}>
            <Button size="lg" variant="secondary" className="w-full gap-2">
              Đặt hàng ngay
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}