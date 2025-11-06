import { Dialog } from "@mui/material";
import styles from './confirmOrderPopup.module.css'

import { useNavigate } from "react-router-dom";


export default function ConfirmOrderPopup ({ open,onClose , onConfirm })  {
    
    const authData = JSON.parse(localStorage.getItem('auth'))
    const navigate = useNavigate()

    const handleConfirm = (e) => {
        e.preventDefault()

        if(!authData.user?._id){
            return navigate('/auth')
        }else{
            const pickupTime = new Date()
           const time = `${pickupTime.getDay()}/${pickupTime.getMonth()}/${pickupTime.getFullYear()}-${pickupTime.getHours()}:${pickupTime.getMinutes()}` 
            const orderData = {
                userId :authData.user?._id,
                pickupTime:time
            }
            
            onConfirm(orderData)
        }
    }

    
    return(
        <Dialog  open={open} onClose={onClose}>
            <div className={styles.confirmContainer}>
                <h2>Estamos quase lá ...</h2>

                <div className={styles.confirmBtn}>
                    <button className={styles.cancelBtn} onClick={() => onClose()}>Cancelar</button>
                    <button onClick={handleConfirm}>Confirmar</button>
                </div>
            </div>
        </Dialog>
    )
}