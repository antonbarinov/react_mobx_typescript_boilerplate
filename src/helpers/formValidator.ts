import { ReactChangeEvent, ReactChangeEventFunc } from 'declarations/types';
import { observable } from 'mobx';
import { IApiError } from 'lib/ApiRequest';

export interface IFormFields {
    [k: string]: FormField;
}

export class FormField<ComponentState = any> {
    private interceptorFunc: ReactChangeEventFunc = null;
    @observable value: string = null;
    @observable errorMessage = '';
    @observable isFieldValid = true;
    componentState: ComponentState = null;
    __serverErrorMark = false;

    constructor(defaultValue = '', interceptorFunc: ReactChangeEventFunc = null) {
        this.value = defaultValue;
        this.interceptorFunc = interceptorFunc;
    }

    onChange = (e: ReactChangeEvent) => {
        const { interceptorFunc } = this;

        if (interceptorFunc) {
            const val = interceptorFunc(e);
            if (val !== undefined) {
                this.value = val;
            }
        } else {
            this.value = e.target.value;
        }
    };
}

export default class FormValidator<TFormFields extends IFormFields> {
    @observable isFormValid = true;
    formFields: TFormFields;
    @observable serverErrorMessage: string = null;
    serverErrorsIndex = 0;

    constructor(formFields: TFormFields) {
        this.formFields = formFields;
    }

    applyServerValidationErrors(e: IApiError): boolean {
        try {
            const response = e.response.data;
            if (response.errorType === undefined) return false;

            let result = false;
            // Validation errors
            if (response.errorType === 'validation') {
                if (Array.isArray(response.errors)) {
                    for (const { field, message } of response.errors) {
                        const item = this.formFields[field];
                        if (item) {
                            item.errorMessage = message;
                            item.isFieldValid = false;
                            item.__serverErrorMark = true;
                        }
                    }

                    for (const fieldName in this.formFields) {
                        const item = this.formFields[fieldName];
                        const hasServerError = response.errors.some(({ field }) => fieldName === field);
                        if (item.__serverErrorMark && !hasServerError) {
                            item.errorMessage = null;
                            item.isFieldValid = true;
                            item.__serverErrorMark = false;
                        }
                    }

                    result = true;
                }
            }
            // Text error from server
            else if (response.errorType === 'message') {
                this.serverErrorMessage = response.errors[0].message;
            }
            // Any cases
            else {
                this.serverErrorMessage = e.message || 'Something went wrong';
            }

            return result;
        } catch (e) {
            console.error(e);
            this.serverErrorMessage = e.message || 'Something went wrong';
            return false;
        }
    }

    async validate<T>(promises: Promise<T>[]) {
        this.isFormValid = true;
        await Promise.all(promises);

        return this.isFormValid;
    }

    async validateField(fieldObject: FormField, validationFunction: (value: FormField['value']) => Promise<string | undefined>) {
        const { value } = fieldObject;
        const result = await validationFunction(value);

        if (result !== undefined) {
            fieldObject.errorMessage = result;
            fieldObject.isFieldValid = false;
            fieldObject.__serverErrorMark = false;
            this.isFormValid = false;
        } else if (fieldObject.__serverErrorMark === false) {
            fieldObject.errorMessage = '';
            fieldObject.isFieldValid = true;
        }
    }

    isFieldsValid() {
        return this.isFormValid;
    }

    getFieldsData() {
        type KeyVal = { [k in keyof TFormFields]: FormField['value'] };
        const result: KeyVal = {} as KeyVal;

        for (let fieldName in this.formFields) {
            if (this.formFields.hasOwnProperty(fieldName)) {
                result[fieldName] = this.formFields[fieldName].value;
            }
        }

        return result;
    }
}
