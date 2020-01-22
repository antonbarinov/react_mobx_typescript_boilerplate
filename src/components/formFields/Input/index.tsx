import React from 'react';
import { observer } from 'mobx-react-lite';
import { FromField } from 'helpers/formValidator';

interface IProps {
    innerRef?: React.Ref<HTMLInputElement>;
    formData: FromField;
    htmlAttrs?: React.InputHTMLAttributes<HTMLInputElement>;
}

export const FormFieldInput = observer((props: IProps) => {
    const { htmlAttrs = {}, formData, innerRef } = props;

    return (
        <div>
            <input
                {...htmlAttrs}
                onChange={formData.onChange}
                value={formData.value}
                ref={innerRef}
            />
            {formData.isFieldValid === false && <b>{formData.errorMessage}</b>}
        </div>
    );
});
