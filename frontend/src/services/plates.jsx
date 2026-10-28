import { useState } from "react";

export default function platesServices() {
    const [plateLoading , setplateLoading] = useState(false)
    const [refetchplates , setRefetchplates] = useState(true)
    const [platesList , setplatesList] = useState([])

    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/plates`

    const getAvailableplates = (userId) => {
        setplateLoading(true)
        fetch(`${url}/availables`, {
            method:'GET',
            headers:{
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
            },
        })
        .then((response) => response.json()) 
        .then((result) => {
           if(result.success){
            setplatesList(result.body)
           }else{
                console.log(result)
           }
        })
        .catch((error)=> {
            console.log(error)
        })
        .finally(() => {
            setplateLoading(false)
            setRefetchplates(false)
        })
    }

    

    return{ getAvailableplates, plateLoading ,refetchplates, platesList}
}