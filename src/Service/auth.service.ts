import HttpService from "@/Service/httpService";


class AuthService extends HttpService {

    login = async (data: any) => {
        try {
            return await this.postRequest({
                url: '/login',
                data: data,
            })
        } catch (error) {
            throw error
        }

    }

    async register(data: any) {
        try {
            return await this.postRequest({
                url: '/register',
                data: data,
                config: {
                    file: true,
                }
            })
        } catch (error) {
            console.error('error in register', error)
            throw error
        }
    }

    async getLoggedInUser() {
        try {
            return await this.getRequest({
                url: '/user',
                config: {
                    auth: true
                }
            })
        } catch (error) {
            throw error
        }
    }

    async logout() {
        try {
            return await this.postRequest({
                url: '/logout',
                config: {
                    auth: true
                }
            })
        } catch (error) {
            throw error
        }
    }
    
    googleLogin = async (data: { token: string }) => {
        return this.postRequest({
            url: "/login/google",
            data,
        })
    }

    async forgotPassword(data: any) {
        try {
            return await this.postRequest({
                url: '/password-reset',
                data: data,
            })
        }
        catch (error) {
            throw error
        }
    }
    async verifyOtp(data: any){
        try {
            return await this.postRequest({
                url: '/verify-password-reset-token',
                data
            })
        }
        catch (error) {
            throw error
        }
    }

    async resetPassword(data:any){

        try {
            return await this.postRequest({
                url: '/handle-password-reset-form',
                data
            })
        }
        catch (error) {
            throw error
        }
    }

    async vendorRegister(data: any) {
        try {
            return await this.postRequest({
                url: '/vendor/registration',
                data: data,
            })
        } catch (error) {
            console.error('error in register', error)
            throw error
        }
    }


}

export const authService = new AuthService();