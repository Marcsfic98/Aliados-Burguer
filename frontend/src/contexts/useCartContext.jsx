import { createContext, useContext, useState } from "react";

const CartContext = createContext()

export function CartProvider({children}) {
    const [cartItems, setCartItems] = useState([])

    const addToCart = (itemToAdd) => {
        const checkItemAlready = cartItems.find((cartItems) => {
            return cartItems._id === itemToAdd._id
        })

        if(!checkItemAlready){
            itemToAdd.quantity = 1
            setCartItems([...cartItems, itemToAdd])
            console.log('o item foi adicionado ao carrinho')
        }else{
            console.log("o item já existe no carrinho")
        }
        
    }

     const updatedCartItems = (items) => {
        setCartItems(items)
    } 

    const clearCart = () => {
        setCartItems([])
    }


    const removeFromCart = (itemId) => {
        const cartItemsSanitized = cartItems.filter((item=>{
            return item._id !== itemId
        }))

        setCartItems(cartItemsSanitized)
    } 



    return(
        <>
            <CartContext.Provider value={{removeFromCart, addToCart ,cartItems , updatedCartItems,clearCart }}>
                {children}
            </CartContext.Provider>
        </>
    )
}

export const useCartContext = () => {
    const context = useContext(CartContext)

    if(!context) {
        console.log('não tem cart context')
    }
    return context
}