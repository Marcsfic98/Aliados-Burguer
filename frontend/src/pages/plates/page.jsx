import { useEffect } from "react"
import platesServices from "../../services/plates"
import Loading from "../loading/page"
import PlateCard from "../../components/plateCard/plateCard"
import styles from './page.module.css'


export default function Plates() {

    const {getAvailableplates,plateLoading,platesList,refetchplates } = platesServices()

     useEffect (() => {
             if (refetchplates){
               getAvailableplates()
            }
        },[ refetchplates])

        if(plateLoading) {
            return (<Loading/>)
        }

        console.log(platesList)
        
    return(
        <div className={styles.platesMain} >
                <h1>HAMBÚRGERS</h1>
            <div className={styles.platesContainer} >

                
                {platesList.map((plate) => (
                    <PlateCard plateData={plate} key={plate._id} />
                ))}
            </div>
        </div>
    )
}