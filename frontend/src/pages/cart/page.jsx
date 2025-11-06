import styles from './page.module.css'
import { useCartContext } from "../../contexts/useCartContext";
import { Link } from "react-router-dom";

import { CiCircleRemove } from "react-icons/ci";
import {  useState } from 'react';
import ConfirmOrderPopup from '../../components/confirmOrderPopup/confirmOrederPopup';
import ordersServices from '../../services/orders';

export default function Cart() {

    
        const {cartItems , updatedCartItems , removeFromCart ,clearCart} = useCartContext()
        const {sendOrders } = ordersServices()
        const [confirmPopupOpem, setConfirmPopupOpem] = useState (false)
       

        const handleChangeItemQty = (mode , itemId ) =>{
            const updatedCart = cartItems.map((item) => {
                if(item._id === itemId)  {
                    if(mode === 'less' && item.quantity > 1) {
                        item.quantity -= 1
                    }else if (mode === 'more'){
                        item.quantity += 1
                    }
                }
                return item
            })
            updatedCartItems(updatedCart)
        }

      const handleOpemPopup = () => {
            
            setConfirmPopupOpem(!confirmPopupOpem)
      }

      const handleConfirmOrder = (orderData) => {
            orderData.items = cartItems.map((item) => {
                return{plateId:item._id , quantity:item.quantity}
            })
            sendOrders(orderData)
            setConfirmPopupOpem(!confirmPopupOpem)
            clearCart()
      }


        return(


            <>
            
       {cartItems && cartItems.length > 0 ? (
            <div  className={styles.fullContainer}>
                <h1 className={styles.txtCart}>Seu Carrinho</h1>
                <div className={styles.cartContainer}>
                { cartItems.map((item) => (
                        <div className={styles.itemContainer} key={item._id}>
                            <img src="/img/promos/promosmash.jpg" alt="" />
                            <div>
                                <h2>{item.name}</h2>
                                <p>{item.description}</p>
                            <div>
                                    <p>Quantidade:</p>

                                    <div className={styles.boxQuantity}>
                                        <div className={styles.btnQuantity}>
                                        <button  onClick={() => (handleChangeItemQty('less', item._id))} >-</button>
                                        <h5>{item.quantity}</h5>
                                        <button  onClick={() => (handleChangeItemQty('more', item._id))}>+</button>
                                    </div>   

                                        <button onClick={() => {removeFromCart(item._id)}} ><CiCircleRemove /></button>
                                    </div>     
                                </div>    

                            </div>    
                        </div>
                    ))}
                </div>
                    <button  onClick={handleOpemPopup} >Confirmar pedido</button>
            </div>
        ): 
        < div className={styles.cartContainerOff}>
            <h1>Seu carrinho está vazio ...</h1>
            <button className={styles.txtCart}><Link className={styles.platesLink} to={'/plates'}>Peça agora</Link></button>
        </div>}

        <ConfirmOrderPopup open={confirmPopupOpem} onClose={handleOpemPopup} onConfirm={handleConfirmOrder} />
            </>
           
        
    )
}