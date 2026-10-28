import { Dialog } from "@mui/material";
import styles from './platePopup.module.css'
import { TbXboxXFilled } from "react-icons/tb";


export default function PlatePopup ({plateData , onClose , addToCart})  {
    return(
        <Dialog  open={true} onClose={onClose}>
            <div className={styles.popupContainer}>
                <img src="/img/promos/promosmash.jpg" alt="" />
                <div className={styles.popupContent}>
                    <TbXboxXFilled className={styles.absolute} onClick={onClose} /> 
                    <h2>{plateData.name}</h2>
                    <p>{plateData.description}</p>
                    <h3>R$ {plateData.price}</h3>
                    <button onClick={() => {addToCart(plateData)}}>Adicione ao Carrinho</button>
                </div>
            </div>
        </Dialog>
    )
}