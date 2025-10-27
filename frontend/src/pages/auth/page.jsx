import { useState } from "react";
import { Button, TextField } from "@mui/material";
import styles from './page.module.css'
import authServices from "../../services/auth.jsx";

export default function Auth() {
    const [formType , setFormType] = useState('login')
    const [formData , setFormData] = useState(null)
    const{ login , signUp ,authLoading} = authServices()

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
        return (<h1>Loading...</h1>)
    }

    if(formType === 'login'){
        return(
            <div className={styles.authPageConteiner} >
                <h1>Entrar</h1>
                <button onClick={handleChangeFormType}>Não tem uma conta ? Clique aqui !</button>
                <form onSubmit={handleSubmitForm}>
                    <TextField
                    required
                    label="Email"
                    type="email"
                    name="email"
                    onChange={handleFormDataChange}
                    />

                      <TextField
                    required
                    label="Senha"
                    type="password"
                    name="password"
                    onChange={handleFormDataChange}
                    />

                    <Button type="submit">Entar</Button>
                </form>
            </div>
        )
    }

    if(formType === 'signup'){
         return(
            <div  className={styles.authPageConteiner} >
                <h1>Cadastre-se</h1>
                <button onClick={handleChangeFormType}>Já tem uma conta ? Clique aqui !</button>

                <form onSubmit={handleSubmitForm}>

                      <TextField
                    required
                    label="Nome Completo"
                    type="name"
                    name="name"
                    onChange={handleFormDataChange}
                    />

                    <TextField
                    required
                    label="Email"
                    type="email"
                    name="email"
                    onChange={handleFormDataChange}
                    />

                    <TextField
                    required
                    label="Senha"
                    type="password"
                    name="password"
                    onChange={handleFormDataChange}
                    />

                   <TextField
                    required
                    label="Confirme a Senha"
                    type="password"
                    name="confirmPassword"
                    onChange={handleFormDataChange}
                    />

                    <Button type="submit">Cadastrar</Button>
                </form>
            </div>
        )
    }
}

