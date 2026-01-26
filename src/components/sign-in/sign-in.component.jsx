import React from 'react';
import FormInput from '../form-input/form-input.component';
import { auth, signInWithGoogle } from '../../firebase/firebase.utils';
import './sign-in.styles.scss';
import CustomButton from '../custom-button/custom-button.component';

class SignIn extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            error: '',
            loading: false
        }
    }

    handleSubmit = async event => {
        event.preventDefault();
        const { email, password } = this.state;
        this.setState({ loading: true, error: '' });

        try {
            await auth.signInWithEmailAndPassword(email, password);
            this.setState({ email: '', password: '', loading: false })
        } catch (error) {
            let errorMessage = error.message;
            
            // Handle specific error codes
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email address. Please check your email or sign up for a new account.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password. Please try again.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address.';
            } else if (error.code === 'auth/user-disabled') {
                errorMessage = 'This account has been disabled. Please contact support.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many failed login attempts. Please try again later or reset your password.';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your internet connection and try again.';
            } else if (error.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid email or password. Please check your credentials and try again.';
            } else {
                errorMessage = 'Sign in failed. Please check your email and password and try again.';
            }
            
            this.setState({ 
                error: errorMessage,
                loading: false
            });
        }
    }

    handleGoogleSignIn = async () => {
        this.setState({ loading: true, error: '' });
        try {
            await signInWithGoogle();
            this.setState({ loading: false });
        } catch (error) {
            let errorMessage = error.message;
            
            // Handle specific Google Sign-In errors
            if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Sign-in was cancelled. Please try again.';
            } else if (error.code === 'auth/popup-blocked') {
                errorMessage = 'Pop-up was blocked by your browser. Please allow pop-ups and try again.';
            } else if (error.code === 'auth/configuration-not-found') {
                errorMessage = 'Google Sign-In is not properly configured. Please contact support.';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your internet connection and try again.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many requests. Please wait a moment and try again.';
            } else {
                errorMessage = 'Google Sign-In failed. Please try again.';
            }
            
            this.setState({ 
                error: errorMessage,
                loading: false
            });
        }
    }

    handleChange = event => {
        const { value, name } = event.target;
        this.setState({ [name]: value })
    }

    render() {
        const { email, password, error, loading } = this.state;
        return (
            <div className='p-6 rounded-lg shadow-md' style={{backgroundColor: '#FEF8F1'}}>
                <h2 className='text-2xl font-bold text-gray-900 mb-2'>I already have an account</h2>
                <p className='text-gray-600 mb-6'>Sign in with your email and password</p>
                {error && (
                    <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
                        {error}
                    </div>
                )}
                <form onSubmit={this.handleSubmit} className='space-y-4'>
                    <FormInput name="email" label="email" type="email" handleChange={this.handleChange} value={email} required />
                    <FormInput name="password" label="password" type="password" handleChange={this.handleChange} value={password} required />
                    <div className='space-y-3 pt-4'>
                        <CustomButton type='submit' disabled={loading}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </CustomButton>
                        <CustomButton type='button' onClick={this.handleGoogleSignIn} isGoogleSignIn disabled={loading}>
                            {loading ? 'Signing In...' : 'Sign In with Google'}
                        </CustomButton>
                    </div>
                </form>
            </div>
        )
    }
}

export default SignIn;