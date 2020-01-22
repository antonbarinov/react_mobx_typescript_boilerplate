export interface IApiResponseUser {
    name: string;
    login: string;
    accessToken: string;
}

export interface IApiResponseSignupOrLogin {
    accessToken: string;
    user: IApiResponseUser;
}
