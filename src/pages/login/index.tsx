import React, { useState } from 'react';
import { Link } from 'lib/Router';
import { Container } from 'components/Container';
import { LoginPageState } from './state';
import { FormFieldInput } from 'components/formFields/Input';

export const LoginPage = () => {
    const [state] = useState(() => new LoginPageState());
    const { formItems, formValidator } = state;

    return (
        <Container>
            <h1>Login</h1>

            <div>
                <div>Login:</div>
                <FormFieldInput formData={formItems.login} htmlAttrs={{ placeholder: 'Login' }} />
            </div>
            <div>
                <div>Password (only digits):</div>
                <FormFieldInput formData={formItems.password} htmlAttrs={{ placeholder: 'Password (only digits)', type: 'password' }} />
            </div>

            <div>
                {formValidator.serverErrorMessage && (
                    <div>
                        <b>{formValidator.serverErrorMessage}</b>
                    </div>
                )}
                {state.isFetching === false && <button onClick={state.validateAndSubmit}>Login</button>}
                {state.isFetching === true && <b>Logging in...</b>}
            </div>

            <div>
                <Link to="/signup">Signup</Link>
            </div>
        </Container>
    );
};
