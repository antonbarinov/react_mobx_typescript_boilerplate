import FormValidator from 'helpers/formValidator';
import { ReactChangeEvent } from 'declarations/types';
import userState from 'globalState/user';
import { smartRedirect } from 'helpers/redirect';
import { observable } from 'mobx';

const passwordInterceptor = (e: ReactChangeEvent) => {
    const val = e.target.value;

    // Accespt only digits
    if (/\D+/g.test(val)) return undefined;

    return val;
};

export class LoginPageState {
    @observable isFetching = false;

    formItems = {
        login: FormValidator.createFormFieldObj(),
        password: FormValidator.createFormFieldObj('', passwordInterceptor),
    };

    formValidator = new FormValidator(this.formItems);

    validateAndSubmit = async () => {
        const { formValidator, formItems } = this;

        const isFormValid = await formValidator.validate([
            formValidator.validateField(formItems.login, async (value: string) => {
                const val = value.trim();
                if (val.length < 3) {
                    return `Min length is 3 symbols`;
                }
                if (val === 'admin') {
                    return `This login is not allowed`;
                }
            }),
            formValidator.validateField(formItems.password, async (value: string) => {
                const val = value.trim();
                if (val.length < 3) {
                    return `Min length is 3 symbols`;
                }

                if (val === '111') {
                    return `This password is not allowed`;
                }
            }),
        ]);

        if (!isFormValid) return;

        try {
            this.isFetching = true;
            await userState.login(formValidator.getFieldsData());
            smartRedirect('/profile');
        } catch (e) {
            formValidator.applyServerValidationErrors(e);
        } finally {
            this.isFetching = false;
        }
    };
}
