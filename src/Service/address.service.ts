import HttpService from "@/Service/httpService";

class AddressService extends HttpService {
    async getAllAddress(params?: any) {
        try {
            return await this.getRequest({
                url: '/market/user/address',
                config: {
                    auth: true,
                    params
                }
            })

        } catch (error) {
            throw error

        }
    }

    async createAddress(data: any) {
        try {
            return await this.postRequest({
                url: '/market/user/address',
                data,
                config: {
                    auth: true
                }
            })
        } catch (error) {
            throw error
        }

    }

    async updateAddress(data: any, id: number) {
        try {
            return await this.putRequest({
                url: `/market/user/address/${id}`,
                data,
                config: {
                    auth: true
                }
            })
        } catch (error) {
            throw error
        }
    }

    async deleteAddress(id: number) {
        try {
            return await this.deleteRequest({
                url: `/market/user/address/${id}`,
                config: {
                    auth: true
                }
            })
        } catch (error) {
            throw error
        }
    }

}

const addressService = new AddressService()
export default addressService
