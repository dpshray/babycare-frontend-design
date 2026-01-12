import HttpService from "@/Service/httpService";


class BabyService extends HttpService {


    async getAllBaby(params?: any) {
        try {
            return await this.getRequest({
                url: '/infant',
                config: {
                    params,
                    auth: true
                }
            })
        } catch (error) {
            throw error

        }

    }

    async addBaby(data: any) {
        try {
            return await this.postRequest({
                url: '/infant',
                data,
                config: {
                    auth: true,
                    file:true,
                }
            })
        } catch (error) {
            throw error

        }
    }

    async getBabbyDetails() {
        try {
            return await this.getRequest({
                url: '/infant',
                config: {
                    auth: true,
                }
            })
        } catch (error) {
            throw error

        }

    }

    async getVaccines(
        babyId: number,
        type: "A" | "B" | "C" | "D" = "A"
    ) {
        try {
            return await this.getRequest({
                url: `/infant/${babyId}`,
                config: {
                    params: {type},
                    auth: true,
                }
            });
        } catch (error) {
            throw error;
        }
    }


    async updateBaby(id: number, data: any) {
        try {
            data.append("_method", "PATCH");
            return await this.postRequest({
                url: `/infant/${id}`,
                data: data,
                config: {
                    auth: true,
                    file: true

                }
            })
        } catch (error) {
            throw error
        }
    }

    async deleteBaby(id: number) {
        try {
            return await this.deleteRequest({
                url: `/infant/${id}`,
                config: {
                    auth: true,

                }
            })
        } catch (error) {
            throw error
        }

    }

    async updateBabyVaccineDate(infantId: number, vaccineId: number) {
        try {
            return await this.patchRequest({
                url: `/update-vaccinated-date/${infantId}`,
                data: { vaccine_id: vaccineId },
                config: { auth: true },
            });
        } catch (error) {
            throw error;
        }
    }


}

const babyService = new BabyService();
export default babyService;