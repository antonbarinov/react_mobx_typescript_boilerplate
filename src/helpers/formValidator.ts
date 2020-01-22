import { anyObject } from 'declarations/types';

type ReactChangeEventFunc = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
) => any;

interface IFromField {
    value: string;
    errorMessage: string;
    isFieldValid: boolean;
    onChange: ReactChangeEventFunc;
    interceptorFunc?: ReactChangeEventFunc;
}

interface IFormFields {
    [k: string]: IFromField;
}

export default class FormValidator {
    isFormValid = true;
    formFields: IFormFields = {};
    serverErrorMessage = '';

    constructor(formFields: IFormFields) {
        this.formFields = formFields;
    }

    static createFormFieldObj(
        defaultValue = '',
        interceptorFunc: ReactChangeEventFunc = null,
    ): IFromField {
        return {
            value: defaultValue,
            errorMessage: '',
            isFieldValid: true,
            onChange(e) {
                if (interceptorFunc) {
                    const val = interceptorFunc(e);
                    if (val !== undefined) {
                        this.value = val;
                    }
                } else {
                    this.value = e.target.value;
                }
            },
        };
    }

    applyServerValidationErrors(e): boolean {
        let response;

        try {
            response = e.response.data;
            if (response.errorType === undefined) return false;
        } catch (e) {
            return false;
        }

        let result = false;
        // Validation errors
        if (response.errorType === 'validation') {
            if (Array.isArray(response.errors)) {
                for (const { field, message } of response.errors) {
                    if (this.formFields[field]) {
                        this.formFields[field].errorMessage = message;
                    }
                }

                result = true;
            }
        }
        // Text error from server
        else if (response.errorType === 'message') {
            this.serverErrorMessage = response.errors[0].message;
        }

        return result;
    }

    async validateField(
        fieldObject: IFromField,
        validationFunction: (value: any) => Promise<string | undefined>,
    ) {
        const { value } = fieldObject;
        const result = await validationFunction(value);

        if (result !== undefined) {
            fieldObject.errorMessage = result;
            fieldObject.isFieldValid = false;
            this.isFormValid = false;
        } else {
            fieldObject.errorMessage = '';
            fieldObject.isFieldValid = true;
        }
    }

    isFieldsValid() {
        return this.isFormValid;
    }

    getFieldsData(): anyObject {
        let result = {};

        for (let fieldName in this.formFields) {
            if (this.formFields.hasOwnProperty(fieldName)) {
                result[fieldName] = this.formFields[fieldName].value;
            }
        }

        return result;
    }
}
