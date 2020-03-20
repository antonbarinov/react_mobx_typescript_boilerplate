import { observable } from 'mobx';
import ApiRequest, { getUserAccessToken } from 'lib/ApiRequest';
import { IApiResponseUser, IApiResponseSignupOrLogin } from './api_interfaces';

class User {
    @observable initialFetching = true;
    @observable isFetching = true;
    @observable user: IApiResponseUser = null;
    @observable authorized = false;

    constructor() {
        this.fetchMe().catch(console.error);
    }

    fetchMe = async () => {
        const accessToken = getUserAccessToken();

        try {
            if (accessToken) {
                this.isFetching = true;
                const response = await new ApiRequest('GET /me').send();

                this.user = response.data;
                this.authorized = true;
            }
        } catch (e) {
            this.user = null;
            this.authorized = false;

            throw e;
        } finally {
            this.initialFetching = false;
            this.isFetching = false;
        }
    };

    logout = () => {
        window.localStorage.removeItem('accessToken');
        this.authorized = false;
        this.user = null;
    };

    login = async (data) => {
        const response = await new ApiRequest('POST /login', false).sendJSON(data);
        const respData: IApiResponseSignupOrLogin = response.data;

        if (respData.accessToken) {
            window.localStorage.setItem('accessToken', respData.accessToken);

            await this.fetchMe();
        }
        // Something wrong here
        else {
            throw new Error(`Unexpected server authorization error`);
        }

        return respData;
    };

    signup = async (data) => {
        const response = await new ApiRequest('POST /signup', false).sendJSON(data);
        const respData: IApiResponseSignupOrLogin = response.data;

        if (respData.accessToken) {
            window.localStorage.setItem('accessToken', respData.accessToken);
            await this.fetchMe();
        }
        // Something wrong here
        else {
            throw new Error(`Unexpected server registration error`);
        }

        return respData;
    };
}

const userState = new User();

export default userState;
