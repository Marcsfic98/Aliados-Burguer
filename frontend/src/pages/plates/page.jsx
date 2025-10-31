import { useEffect } from "react"
import platesServices from "../../services/plates"
import Loading from "../loading/page"


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
        <>
            
        </>
    )
}