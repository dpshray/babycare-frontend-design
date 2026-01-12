import HttpServices from "@/Service/httpService";


class CartService extends HttpServices {
    async addToCart(data: any) {
        try {
            return await this.postRequest({
                url: '/market/add-to-cart',
                data,
                config: {
                    auth: true
                }

            })
        } catch (error) {
            throw error;
        }
    }

    // async getCartDetails(itemUuid: string[]) {
    //     try {
    //         return await this.postRequest({
    //             url: `/market/checkout-detail`,
    //             data: itemUuid,
    //             config: {
    //                 auth: true,
    //             },
    //         });
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    
    async getCartDetails(payload: any) {
        try {
            return await this.postRequest({
            url: `/market/checkout-detail`,
            data: payload,  
            config: {
                auth: true,
            },
            });
        } catch (error) {
            throw error;
        }
    }



    async updateCartItem(itemUuid: string, quantity: number) {
        try {
            return this.postRequest({
                url: `/market/update-cart-item/${itemUuid}`,
                data: {quantity},
                config: {
                    auth: true,
                },
            });
        } catch (error) {
            throw error;
        }
    }


    async getMyCart() {
        try {
            return this.getRequest({
                url: "/market/my-cart",
                config: {
                    auth: true
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async removeCartItems(itemUuids: string[]) {
        try {
            return await this.deleteRequest({
                url: "/market/remove-cart-item",
                data: {
                    item_uuids: itemUuids,
                },
                config: {
                    auth: true,
                },
            });
        } catch (error) {
            throw error;
        }
    }

}

const cartService = new CartService();
export default cartService;
