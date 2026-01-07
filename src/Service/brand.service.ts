import HttpServices from "@/Service/httpService";


class BrandService extends HttpServices {


    async getAllBrands(params?: any) {
        try {
            return await this.getRequest({
                url: '/market/get-brand-list',
                config: {
                    params
                }
            })
        } catch (error) {
            throw error;
        }
    }


}

const brandService = new BrandService();
export default brandService;

