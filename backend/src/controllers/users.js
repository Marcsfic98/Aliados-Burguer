import UsersDataAccess from "../dataAccess/users.js";
import {ok , serverError} from '../helpers/httpResponse.js'

export default class UsersControllers {
    constructor() {
        this.dataAccess = new UsersDataAccess()
    }

    async getUsers() {
        try {
            const users = await this.dataAccess.getUsers()

            return ok(users)
        } catch (error) {
            return serverError(error)
        }
    }
}