'use client'

import {createContext, useState, useEffect} from 'react'
import {getAPI} from '@/lib/api'

export const ProductContext = createContext()

export function ProductProvider({children}){
    const [productItem, setProductItem] = useState([])

    useEffect(()=>{
        const fetchProductData = async()=>{
            try{
                const data = await getAPI('products')
                setProductItem(data)
            }catch(error){
                console.error('Error fetching cart:', error)
            }
        }
        fetchProductData()
    },[])

    return(
        <ProductContext.Provider value={{productItem}}>
            {children}
        </ProductContext.Provider>
    )
}