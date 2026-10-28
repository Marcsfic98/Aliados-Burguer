import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authServices from "../../services/auth";
import ordersServices from "../../services/orders";
import styles from './page.module.css'
import { LuLogOut ,LuTimer , LuCircleAlert , LuCircleCheck , LuTrash } from "react-icons/lu";
import { Link } from "react-router-dom";
import Loading from "../loading/page";

export default function Profile() {
    const navigate = useNavigate()
    const authData = JSON.parse(localStorage.getItem('auth'))
    const {logout} = authServices()
    const {getUserOrders, orderLoading , refetchOrders, ordersList} = ordersServices()
    

    useEffect (() => {
        if(!authData){
             navigate('/auth')
        } else if (refetchOrders){
           getUserOrders(authData?.user?._id)
        }
    },[authData ,navigate , refetchOrders])

    if(orderLoading) {
        return(<Loading/>)
    }

   const  handleLogout = () => {
        logout()
        return navigate('/')
    }

    console.log(ordersList)

    return(
        <div className={styles.pageContainer} >
           <div className={styles.userMain}>
                <div className={styles.infosUser}>
                    <h1>{authData?.user?.name}</h1>
                    <h3>{authData?.user?.email}</h3>
                </div>
                <div className={styles.btnSair}>
                    <button onClick={handleLogout}>Sair <LuLogOut/></button>
                </div>
           </div>

            {ordersList.length > 0 ?
            <div className={styles.ordersContainer}>
                {ordersList.map((order) => (
                    <div className={styles.orderContainer} key={order._id}>
                        {order.pickupStatus ==='Pending' ? <p className={`${styles.pickupstatus} ${styles.pending}`} ><LuTimer/> Pendente</p> : null}
                        {order.pickupStatus ==='Completed' ? <p className={`${styles.pickupstatus} ${styles.completed}`} ><LuCircleCheck/>  Completo</p> : null}
                        {order.pickupStatus ==='Canceled' ? <p className={`${styles.pickupstatus} ${styles.canceled}`} ><LuCircleAlert/>  Cancelado</p> : null}
                        <h3>{order.pickupTime}</h3>
                        <br/>
                        {order.orderItems.map((item) => (
                            <div  key={item._id}>
                                <h4>{item.itemDetails[0].name}</h4>
                                <p>Quantidade : {item.quantity}</p>
                                <br/>
                            </div>
                        ))}

                        <div className={styles.buttons}>
                            <LuTrash/>
                        </div>
                    </div>
                ))}
            </div>

        :   <div className={styles.notPlates}>
                Você ainda não fez seu pedido ...
                <button><Link className={styles.platesLink} to={'/plates'}>Peça agora</Link></button>
            </div>
            }
        </div>
    )
}