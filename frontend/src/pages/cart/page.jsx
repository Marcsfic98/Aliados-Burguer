import styles from './page.module.css'
import { useCartContext } from "../../contexts/useCartContext";
import { Link } from "react-router-dom";

import { CiCircleRemove } from "react-icons/ci";

export default function Cart() {

    
        const {cartItems} = useCartContext()

        console.log(cartItems)

        return(

       cartItems && cartItems.length > 0 ? (
            <div  className={styles.fullContainer}>
                <h1 className={styles.txtCart}>Seu Carrinho</h1>
                <div className={styles.cartContainer}>
                { cartItems.map((order) => (
                        <div className={styles.orderContainer} key={order.id}>
                            <img src="/img/promos/promosmash.jpg" alt="" />
                            <div>
                                <h2>{order.name}</h2>
                                <p>{order.description}</p>
                            <div>
                                    <p>Quantidade:</p>

                                    <div className={styles.boxQuantity}>
                                        <div className={styles.btnQuantity}>
                                        <button>-</button>
                                        <h2>{order.quantity}</h2>
                                        <button>+</button>
                                    </div>   

                                        <button><CiCircleRemove /></button>
                                    </div>     
                                </div>    

                            </div>    
                        </div>
                    ))}
                </div>
                    <button>Confirmar pedido</button>
            </div>
        ): 
        < div className={styles.cartContainerOff}>
            <h1>Seu carrinho está vazio ...</h1>
            <button className={styles.txtCart}><Link className={styles.platesLink} to={'/plates'}>Peça agora</Link></button>
        </div>
           
        
    )
}