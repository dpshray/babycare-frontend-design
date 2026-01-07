import HttpService from "@/Service/httpService";

class OrderService extends HttpService {

    async createOrder(orderData: any) {
        try {
            return await this.postRequest({
                url: '/market/orders',
                data: orderData,
                config: {
                    auth: true,
                }
            })

        } catch (error) {
            throw error
        }

    }

    async getAllOrder(params?: any) {
        try {
            return await this.getRequest({
                url: '/market/my-orders',
                config: {
                    auth: true,
                    params
                }
            })

        } catch (error) {
            throw error
        }

    }

    async getOrder(orderUUID: string, params?: any) {
        try {
            return await this.getRequest({
                url: `/market/my-order-detail/${orderUUID}`,
                config: {
                    auth: true,
                    params
                }
            })

        } catch (error) {
            throw error
        }

    }


}

const orderService = new OrderService()
export default orderService
