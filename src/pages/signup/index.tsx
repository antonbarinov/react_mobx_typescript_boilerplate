import React from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'lib/Router';
import { Container } from 'components/Container';
import { SignupPageState } from './state';
import { useLocalState } from 'hooks/useLocalState';
import { FormFieldInput } from 'components/formFields/Input';

export const SignupPage = observer(() => {
    const state = useLocalState(SignupPageState);
    const { formItems, formValidator } = state;

    return (
        <Container>
            <h1>Signup</h1>

            <div>
                <div>Your Name:</div>
                <FormFieldInput formData={formItems.name} htmlAttrs={{ placeholder: 'Your Name' }} />
            </div>
            <div>
                <div>Login:</div>
                <FormFieldInput formData={formItems.login} htmlAttrs={{ placeholder: 'Login' }} />
            </div>
            <div>
                <div>Password (only digits):</div>
                <FormFieldInput formData={formItems.password} htmlAttrs={{ placeholder: 'Password (only digits)', type: 'password' }} />
            </div>

            <div>
                {formValidator.serverErrorMessage && <b>{formValidator.serverErrorMessage}</b>}
                {state.isFetching === false && <button onClick={state.validateAndSubmit}>Signup</button>}
                {state.isFetching === true && <b>Signing up...</b>}
            </div>

            <div>
                <Link to="/login">Login</Link>
            </div>
        </Container>
    );
});
