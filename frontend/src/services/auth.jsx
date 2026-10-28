import { useState } from "react";

export default function authServices() {
    const [authLoading , setAuthLoading] = useState(false)

    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth`

    const login = (formData) => {
        setAuthLoading(true)
        fetch(`${url}/login`, {
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
            },
            body: JSON.stringify(formData)
        })
        .then((response) => response.json()) 
        .then((result) => {
            if(result.success && result.body.token) {
                localStorage.setItem(
                    'auth',
                    JSON.stringify({token:result.body.token ,user:result.body.user})
                )
            }
        })
        .catch((error)=> {
            console.log(error)
        })
        .finally(() => {
            setAuthLoading(false)
        })
    }

    const logout = () => {
        localStorage.removeItem('auth')
    }

    const signUp = (formData) => {
                setAuthLoading(true)
        fetch(`${url}/singup`, {
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
            },
            body: JSON.stringify(formData)
        })
        .then((response) => response.json()) 
        .then((result) => {
             if(result.success && result.body.token) {
                localStorage.setItem(
                    'auth',
                    JSON.stringify({token:result.body.token ,user:result.body.user})
                )
            }
            
        })
        .catch((error)=> {
            console.log(error)
        })
        .finally(() => {
            setAuthLoading(false)
        })
    }

    return{ login , logout , signUp , authLoading}
}