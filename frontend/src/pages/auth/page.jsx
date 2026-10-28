import { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import styles from './page.module.css'
import authServices from "../../services/auth.jsx";
import { useNavigate } from "react-router-dom";
import { LuLogIn } from "react-icons/lu";
import Loading from "../loading/page.jsx";

export default function Auth() {
    const [formType , setFormType] = useState('login')
    const [formData , setFormData] = useState(null)
    const{ login , signUp ,authLoading} = authServices()

    const navigate = useNavigate()
    const authData = JSON.parse(localStorage.getItem('auth'))

    useEffect (() => {
        if(authData){
             navigate('/profile')
        }
    },[authData ,navigate])

    const handleChangeFormType = () => {
        setFormData(null)
        if(formType === 'login'){
            setFormType('signup')
        }else{
            setFormType('login')
        }
    }


    const handleFormDataChange = (e) => {
        setFormData({
            ...formData,
           [ e.target.name]: e.target.value
        })
    }

    const handleSubmitForm = (e) => {
        e.preventDefault()
        switch (formType) {
            case 'login' :
                login(formData)
            break
            case 'signup':
                if(formData.password !== formData.confirmPassword){
                    console.log('senha nao esta igual')
                    return
                }
                signUp(formData)
            break
        }
    }

    if(authLoading){
        return (<Loading/>)
    }

    if(formType === 'login'){
        return(
            <div className={styles.authPageConteiner} >
               {formType === 'login' ? (
                <>
                     <h1>Entrar</h1>
                <button onClick={handleChangeFormType}>Não tem uma conta ? Clique aqui !</button>
                <form onSubmit={handleSubmitForm}>
                    <input
                    required
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    onChange={handleFormDataChange}
                    />

                      <input
                    required
                    label="Senha"
                    type="password"
                    name="password"
                    placeholder="senha"
                    onChange={handleFormDataChange}
                    />

                    <button type="submit">Entar <LuLogIn/></button>
                </form>
                </>
               ):null}
            </div>
        )
    }

    if(formType === 'signup'){
         return(
            <div  className={styles.authPageConteiner} >
            {formType === 'signup' ? (
                <>
                    <h1>Cadastre-se</h1>
                <button onClick={handleChangeFormType}>Já tem uma conta ? Clique aqui !</button>

                <form onSubmit={handleSubmitForm}>

                      <input
                    required
                    label="Nome Completo"
                    type="name"
                    name="name"
                    placeholder="Nome Completo"
                    onChange={handleFormDataChange}
                    />

                    <input
                    required
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    onChange={handleFormDataChange}
                    />

                    <input
                    required
                    label="Senha"
                    type="password"
                    name="password"
                    placeholder="senha"
                    onChange={handleFormDataChange}
                    />

                   <input
                    required
                    label="Confirme a Senha"
                    type="password"
                    name="confirmPassword"
                    placeholder="confirmar senha"
                    onChange={handleFormDataChange}
                    />

                    <button type="submit">Cadastrar</button>
                </form>
                </>
            ):null
            }
            </div>
        )
    }
}

