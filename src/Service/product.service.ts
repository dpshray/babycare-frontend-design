import HttpServices from "@/Service/httpService";

class ProductService extends HttpServices {

    async getAllProducts(params?: any) {
        try {
            const response = await this.getRequest({
                url: "/market/products",
                config: {
                    params,
                    auth: true

                }
            })
            console.log('Response from Product', response);
            return response;

        } catch (error) {
            console.log('Error from Product', error);
            throw error;

        }
    }

    async getProduct(slug: string) {
        try {
            return await this.getRequest({
                url: `/market/product/${slug}`,
                config: {

                }
            });
        } catch (error) {
            throw error;
        }
    }


    async getProductReviews(slug: string, params?: any) {
        try {
            return await this.getRequest({
                url: `/market/product/${slug}/review`,
                config: {
                    params
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async addToFavorite(slug: string) {
        try {
            const response = await this.getRequest({
                url: `/market/favourite/${slug}/product`,
                config: {
                    auth: true
                },
            });
            console.log("Added to favorite", response);
            return response;
        } catch (error) {
            console.log("Error adding to favorite", error);
            throw error;
        }
    }

    async createProductReview(slug: string, data: any) {
        try {
            return await this.postRequest({
                url: `/market/product/${slug}/review`,
                data,
                config: {
                    auth: true
                }
            })
        } catch (error) {
            throw error;
        }

    }

    async updateProductReview(slug: string, uuid: string, data: any) {
        try {
            return await this.patchRequest({
                url: `/market/product/${slug}/review/${uuid}`,
                data,
                config: {
                    auth: true
                }
            })
        } catch (error) {
            throw error;
        }

    }

    async deleteProductReview(slug: string, uuid: string) {
        try {
            return await this.deleteRequest({
                url: `/market/product/${slug}/review/${uuid}`,
                config: {
                    auth: true
                }
            })
        } catch (error) {
            throw error;
        }


    }

    async favouritesProduct(params?: any) {
        try {
            return await this.getRequest({
                url: `/market/liked-items`,
                config: {
                    auth: true,
                    params
                }
            })
        } catch (error) {
            throw error;
        }
    }
}

const productService = new ProductService();
export default productService;

