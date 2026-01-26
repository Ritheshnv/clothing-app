import React, { useState } from 'react';
import { connect } from 'react-redux';
import { processPayment, createRazorpayOrder } from '../../utils/payment.utils';
import { clearCart } from '../../redux/cart/cart.actions';

const RazorpayButton = ({ price, currentUser, clearCart }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handlePayment = async () => {
        if (!currentUser) {
            setMessage('Please sign in to continue with payment');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            // Create order
            const orderData = await createRazorpayOrder(price);
            
            // User details for prefill
            const userDetails = {
                name: currentUser.displayName || '',
                email: currentUser.email || '',
                phone: currentUser.phone || '',
                address: currentUser.address || '',
            };

            // Process payment
            await processPayment(
                orderData,
                userDetails,
                (response) => {
                    // Payment success
                    console.log('Payment successful:', response);
                    setMessage('Payment successful! Order placed.');
                    clearCart();
                    setLoading(false);
                },
                (error) => {
                    // Payment failure
                    console.error('Payment failed:', error);
                    setMessage(error || 'Payment failed. Please try again.');
                    setLoading(false);
                }
            );
        } catch (error) {
            console.error('Payment error:', error);
            setMessage('Payment failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {message && (
                <div className={`p-3 rounded text-sm ${
                    message.includes('successful') 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                }`}>
                    {message}
                </div>
            )}
            
            <button
                onClick={handlePayment}
                disabled={loading || price === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Processing...</span>
                    </>
                ) : (
                    <>
                        <span>Pay ₹{price}</span>
                        <span className="text-xs">(UPI/Card/Net Banking)</span>
                    </>
                )}
            </button>
            
            <div className="text-xs text-gray-500 text-center">
                Secure payment powered by Razorpay
            </div>
        </div>
    );
};

const mapStateToProps = ({ user: { currentUser } }) => ({
    currentUser
});

const mapDispatchToProps = dispatch => ({
    clearCart: () => dispatch(clearCart())
});

export default connect(mapStateToProps, mapDispatchToProps)(RazorpayButton);