import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authServices from "../../services/auth";

export default function Profile() {
    const navigate = useNavigate()
    const authData = JSON.parse(localStorage.getItem('auth'))
    const {logout} = authServices()
    

    useEffect (() => {
        if(!authData){
             navigate('/auth')
        }
    },[authData ,navigate])

   const  handleLogout = () => {
        logout()
        return navigate('/')
    }

    return(
        <>
            <h1>{authData?.user?.name}</h1>
            <h3>{authData?.user?.email}</h3>
            <button onClick={handleLogout}>Sair</button>
        </>
    )
}