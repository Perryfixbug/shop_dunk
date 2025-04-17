'use client';

import { createContext, useState, useEffect } from 'react';
import { getAPI } from './api';
import { getCookie } from './cookie'; 

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const token = getCookie("token"); //Nếu người dùng đã đăng nhập, lấy token từ cookie
  useEffect(() => {
    const fetchCart = async () => {
        try {
            // Lấy giỏ hàng từ localStorage (cho khách vãng lai)
            const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
            setCartItems(storedCart);
            // Nếu người dùng đã đăng nhập, fetch từ API
            if (token) {
                const cartData = await getAPI('carts',{
                    Authorization: `Bearer ${token}`,
                  }); 
                setCartItems(cartData.items);
                localStorage.setItem('cart', JSON.stringify(cartData.items)); // Lưu vào localStorage
                console.log('Giỏ hàng từ API:', cartData.items);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    }
    fetchCart();
  }, [token]); 

  // Cập nhật giỏ hàng và đồng bộ với localStorage
  const updateCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  // Tính số lượng sản phẩm (tổng số item)
  const cartCount = cartItems.length || 0;

  return (
    <CartContext.Provider value={{ cartItems, updateCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}