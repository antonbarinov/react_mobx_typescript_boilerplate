import React from 'react';
import { FormField } from 'helpers/formValidator';

interface IProps {
    innerRef?: React.Ref<HTMLInputElement>;
    formData: FormField;
    htmlAttrs?: React.InputHTMLAttributes<HTMLInputElement>;
}

export const FormFieldInput = (props: IProps) => {
    const { htmlAttrs = {}, formData, innerRef } = props;

    return (
        <div>
            <input {...htmlAttrs} onChange={formData.onChange} value={formData.value} ref={innerRef} />
            {formData.isFieldValid === false && <b>{formData.errorMessage}</b>}
        </div>
    );
};
