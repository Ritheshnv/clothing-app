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
            confirmPassword: '',
            error: '',
            loading: false
        }
    }

    handleSubmit = async event => {
        event.preventDefault();
        const { displayName, email, password, confirmPassword } = this.state;
        this.setState({ loading: true, error: '' });

        if (password !== confirmPassword) {
            this.setState({ 
                error: "Passwords don't match",
                loading: false 
            });
            return;
        }

        if (password.length < 6) {
            this.setState({ 
                error: "Password must be at least 6 characters",
                loading: false 
            });
            return;
        }

        try {
            const { user } = await auth.createUserWithEmailAndPassword(email, password);

            try {
                await createUserProfileDocument(user, { displayName });
            } catch (profileError) {
                console.warn('Profile creation failed, but account was created:', profileError);
                // Don't throw error here as the account was successfully created
            }

            this.setState({
                displayName: '',
                email: '',
                password: '',
                confirmPassword: '',
                loading: false
            })

        } catch (error) {
            let errorMessage = error.message;
            
            // Handle specific error codes
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'An account with this email already exists. Please sign in instead.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak. Please choose a stronger password.';
            } else if (error.code === 'auth/operation-not-allowed') {
                errorMessage = 'Email/password accounts are not enabled. Please contact support.';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your internet connection and try again.';
            }
            
            this.setState({ 
                error: errorMessage,
                loading: false 
            });
        }
    }

    handleChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value })
    }

    render() {
        const { displayName, email, password, confirmPassword, error, loading } = this.state;
        return (
            <div className='p-6 rounded-lg shadow-md' style={{backgroundColor: '#FEF8F1'}}>
                <h2 className='text-2xl font-bold text-gray-900 mb-2'>I do not have an account</h2>
                <p className='text-gray-600 mb-6'>Sign up with your email and password</p>
                {error && (
                    <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
                        {error}
                    </div>
                )}
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
                        <CustomButton type='submit' disabled={loading}>
                            {loading ? 'Creating Account...' : 'SIGN UP'}
                        </CustomButton>
                    </div>
                </form>
            </div>
        )
    }
}

export default SignUp;