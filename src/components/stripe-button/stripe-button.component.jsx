import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51234567890abcdef');

const CheckoutForm = ({ price }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !elements) {
            setLoading(false);
            return;
        }

        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.error(error);
            alert('Payment failed: ' + error.message);
        } else {
            console.log('PaymentMethod:', paymentMethod);
            alert(`Payment of $${price} successful!`);
        }
        
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='p-4 border border-gray-300 rounded-md'>
                <CardElement 
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                        },
                    }}
                />
            </div>
            <button 
                type='submit' 
                disabled={!stripe || loading}
                className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-md font-medium transition-colors'
            >
                {loading ? 'Processing...' : `Pay $${price}`}
            </button>
        </form>
    );
};

const StripCheckoutButton = ({ price }) => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm price={price} />
        </Elements>
    );
};

export default StripCheckoutButton;