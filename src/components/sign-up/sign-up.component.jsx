import React from 'react';

import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';

import { auth, createUserProfileDocument } from '../../firebase/firebase.utils';

import './sign-up.styles.scss';

class SignUp extends React.Component {
    constructor() {
        super();

        this.state = {
            displayName: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    }

    handleSubmit = async event => {
        event.preventDefault();
        const { displayName, email, password, confirmPassword } = this.state;

        if (password !== confirmPassword) {
            alert("passwords dont match");
            return;
        }

        try {
            const { user } = await auth.createUserWithEmailAndPassword(email, password);

            await createUserProfileDocument(user, { displayName });

            this.setState({
                displayName: '',
                email: '',
                password: '',
                confirmPassword: ''
            })

        } catch (error) {
            console.log(error);
        }
    }

    handleChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value })
    }

    render() {
        const { displayName, email, password, confirmPassword } = this.state;
        return (
            <div className='p-6 rounded-lg shadow-md' style={{backgroundColor: '#FEF8F1'}}>
                <h2 className='text-2xl font-bold text-gray-900 mb-2'>I do not have an account</h2>
                <p className='text-gray-600 mb-6'>Sign up with your email and password</p>
                <form className='space-y-4' onSubmit={this.handleSubmit}>
                    <FormInput
                        type='text'
                        value={displayName}
                        name='displayName'
                        handleChange={this.handleChange}
                        label='Display Name'
                        required
                    />
                    <FormInput
                        type='email'
                        value={email}
                        name='email'
                        handleChange={this.handleChange}
                        label='Email'
                        required
                    />
                    <FormInput
                        type='password'
                        value={password}
                        name='password'
                        handleChange={this.handleChange}
                        label='Password'
                        required
                    />
                    <FormInput
                        type='password'
                        value={confirmPassword}
                        name='confirmPassword'
                        handleChange={this.handleChange}
                        label='Confirm Password'
                        required
                    />
                    <div className='pt-4'>
                        <CustomButton type='submit'>SIGN UP</CustomButton>
                    </div>
                </form>
            </div>
        )
    }
}

export default SignUp;