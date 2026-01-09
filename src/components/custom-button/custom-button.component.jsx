import React from 'react';

import './custom-button.styles.scss';

const CustomButton = ({children, isGoogleSignIn, inverted, ...otherProps}) => {
    let buttonClasses = 'w-full py-3 px-6 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    if (isGoogleSignIn) {
        buttonClasses += ' bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500';
    } else if (inverted) {
        buttonClasses += ' bg-white border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white focus:ring-gray-500';
    } else {
        buttonClasses += ' bg-gray-900 hover:bg-gray-800 text-white focus:ring-gray-500';
    }
    
    return (
        <button className={buttonClasses} {...otherProps}>
            {children}
        </button>
    )
}

export default CustomButton;