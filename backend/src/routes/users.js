import express from 'express'
import UsersControllers from '../controllers/users.js'

const usersRouter = express.Router()

const usersControllers =new UsersControllers()

usersRouter.get('/', async(req , res) => {
    const { success , statusCode ,body} = await usersControllers.getUsers()

    res.status(statusCode).send({success , statusCode ,body})
})


usersRouter.delete('/:id', async (req , res) => {
    if (!/^\d+$/.test(req.params.id) || !Number.isSafeInteger(Number(req.params.id)) || Number(req.params.id) < 1) {
        return res.status(400).send({ success: false, message: 'Identificador de usuário inválido.' });
    }

    const { success , statusCode ,body} = await usersControllers.deleteUsers(req.params.id)

    res.status(statusCode).send({success , statusCode ,body})
})

usersRouter.put('/:id', async (req , res) => {
    if (!/^\d+$/.test(req.params.id) || !Number.isSafeInteger(Number(req.params.id)) || Number(req.params.id) < 1) {
        return res.status(400).send({ success: false, message: 'Identificador de usuário inválido.' });
    }

    const { success , statusCode ,body} = await usersControllers.updateUsers(req.params.id , req.body)

    res.status(statusCode).send({success , statusCode ,body})
})

export default usersRouter