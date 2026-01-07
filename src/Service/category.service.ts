import HttpServices from "@/Service/httpService";


class CategoriesService extends HttpServices {


    async getAllCategories(params?: any) {
        try {
            return await this.getRequest({
                url: '/market/get-category-list',
                config: {
                    params
                }
            })
        } catch (error) {
            throw error;
        }
    }



}

const categoriesService = new CategoriesService();
export default categoriesService;
