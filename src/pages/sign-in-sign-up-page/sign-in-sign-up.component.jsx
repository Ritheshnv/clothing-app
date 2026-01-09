import React from 'react';
import SignIn from '../../components/sign-in/sign-in.component';
import SignUp from '../../components/sign-up/sign-up.component';
import './sign-in-sign-up.styles.scss';

const SignInSignUpPage = () => (
    <div className='max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>
            <SignIn />
            <SignUp/>
        </div>
    </div>
)

export default SignInSignUpPage;