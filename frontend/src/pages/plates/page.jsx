import { useEffect, useState } from "react"
import platesServices from "../../services/plates"
import Loading from "../loading/page"
import PlateCard from "../../components/plateCard/plateCard"
import styles from './page.module.css'
import PlatePopup from "../../components/platePopup/platePopup"
import { useCartContext } from "../../contexts/useCartContext"


export default function Plates() {

    const {getAvailableplates,plateLoading,platesList,refetchplates } = platesServices()
    const [plateSelected , setPlateSelected] = useState(null)
    const { addToCart} = useCartContext()

     useEffect (() => {
             if (refetchplates){
               getAvailableplates()
            }
        },[ refetchplates])

        if(plateLoading) {
            return (<Loading/>)
        }

        const handlePlateSelected = (plate) => {
            setPlateSelected(plate)
        }

        const handleClosePopup = () => {
            setPlateSelected(null)
        }

        const handleAddToCart = (itemToAdd) => {
            addToCart(itemToAdd)
            handleClosePopup()
        }
        
    return(
        <div className={styles.platesMain} >
                <h1>HAMBÚRGERS</h1>
            <div className={styles.platesContainer} >

                
                {platesList.map((plate) => (
                    <div  key={plate._id} onClick={() => {handlePlateSelected(plate)}}>
                        <PlateCard plateData={plate} key={plate._id} onClick={handleClosePopup} />
                    </div>    
                ))}
            </div>

            {plateSelected&&
                   <PlatePopup plateData={plateSelected} onClose={handleClosePopup} addToCart={handleAddToCart}/> 
            }
        </div>
    )
}