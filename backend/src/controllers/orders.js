

import OrdersDataAccess from '../dataAccess/orders.js'
import {ok , serverError} from '../helpers/httpResponse.js'

export default class OrdersControllers {
    constructor() {
        this.dataAccess = new OrdersDataAccess()
    }

    async getOrders() {
        try {
            const orders = await this.dataAccess.getOrders()

            return ok(orders)
        } catch (error) {
            return serverError(error)
        }
    }

    async addOrders(orderData) {
        try {
            const result = await this.dataAccess.addPlate(orderData)

            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }

       async deleteOrders(orderId) {
        try {
            const result = await this.dataAccess.deletePlate(orderId)

            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }

    async updateOrders(orderId , orderData) {
        try {
            const result = await this.dataAccess.updatePlate(orderId, orderData)

            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }
}